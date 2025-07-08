import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "../database";
import { AuthenticatedRequest } from "../auth";
import { CreateOrderRequest, Order, OrderItem, ApiResponse } from "@shared/api";

// Create new order
export const handleCreateOrder: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
) => {
  try {
    const { restaurantId, items, deliveryAddress, paymentMethod } =
      req.body as CreateOrderRequest;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      } as ApiResponse);
    }

    // Validation
    if (
      !restaurantId ||
      !items ||
      items.length === 0 ||
      !deliveryAddress ||
      !paymentMethod
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      } as ApiResponse);
    }

    // Verify user exists
    const userExists = db
      .prepare("SELECT id FROM users WHERE id = ?")
      .get(userId);
    if (!userExists) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      } as ApiResponse);
    }

    // Verify restaurant exists
    const restaurant = db
      .prepare("SELECT id FROM restaurants WHERE id = ? AND is_active = TRUE")
      .get(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      } as ApiResponse);
    }

    // Calculate total amount and verify menu items
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const menuItem = db
        .prepare(
          `
        SELECT id, price, name FROM menu_items
        WHERE id = ? AND restaurant_id = ? AND is_available = TRUE
      `,
        )
        .get(item.menuItemId, restaurantId) as any;

      if (!menuItem) {
        return res.status(400).json({
          success: false,
          message: `Menu item ${item.menuItemId} not found or not available`,
        } as ApiResponse);
      }

      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;

      validatedItems.push({
        ...item,
        price: menuItem.price,
        name: menuItem.name,
      });
    }

    const orderId = uuidv4();
    const estimatedDeliveryTime = Date.now() + 45 * 60 * 1000; // 45 minutes from now

    // Use database transaction to ensure atomicity
    try {
      const transaction = db.transaction(() => {
        // Insert order first
        const insertOrder = db.prepare(`
          INSERT INTO orders (
            id, user_id, restaurant_id, total_amount, delivery_address,
            payment_method, estimated_delivery_time
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        insertOrder.run(
          orderId,
          userId,
          restaurantId,
          totalAmount,
          deliveryAddress,
          paymentMethod,
          estimatedDeliveryTime,
        );

        // Insert order items
        const insertOrderItem = db.prepare(`
          INSERT INTO order_items (id, order_id, menu_item_id, quantity, price)
          VALUES (?, ?, ?, ?, ?)
        `);

        for (const item of validatedItems) {
          insertOrderItem.run(
            uuidv4(),
            orderId,
            item.menuItemId,
            item.quantity,
            item.price,
          );
        }
      });

      // Execute the transaction
      transaction();
    } catch (transactionError) {
      console.error("Order creation transaction failed:", transactionError);
      return res.status(500).json({
        success: false,
        message: "Order creation failed due to data validation error",
      } as ApiResponse);
    }

    // Fetch the created order with details
    const newOrder = db
      .prepare(
        `
      SELECT
        o.id, o.user_id as userId, o.restaurant_id as restaurantId,
        o.status, o.total_amount as totalAmount, o.delivery_address as deliveryAddress,
        o.payment_method as paymentMethod, o.payment_status as paymentStatus,
        o.estimated_delivery_time as estimatedDeliveryTime, o.created_at as createdAt,
        r.name as restaurantName
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.id = ?
    `,
      )
      .get(orderId) as any;

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        ...newOrder,
        estimatedDeliveryTime: new Date(
          newOrder.estimatedDeliveryTime,
        ).toISOString(),
      },
    } as ApiResponse<Order>);
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order. Please try again.",
    } as ApiResponse);
  }
};

// Get user's orders
export const handleGetUserOrders: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      } as ApiResponse);
    }

    const orders = db
      .prepare(
        `
      SELECT
        o.id, o.user_id as userId, o.restaurant_id as restaurantId,
        o.status, o.total_amount as totalAmount, o.delivery_address as deliveryAddress,
        o.payment_method as paymentMethod, o.payment_status as paymentStatus,
        o.estimated_delivery_time as estimatedDeliveryTime, o.created_at as createdAt,
        r.name as restaurantName, r.image_url as restaurantImage
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `,
      )
      .all(userId) as any[];

    const formattedOrders = orders.map((order) => ({
      ...order,
      estimatedDeliveryTime: new Date(
        order.estimatedDeliveryTime,
      ).toISOString(),
    }));

    res.json({
      success: true,
      message: "Orders fetched successfully",
      data: formattedOrders,
    } as ApiResponse<Order[]>);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse);
  }
};

// Get specific order
export const handleGetOrder: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      } as ApiResponse);
    }

    const order = db
      .prepare(
        `
      SELECT
        o.id, o.user_id as userId, o.restaurant_id as restaurantId,
        o.status, o.total_amount as totalAmount, o.delivery_address as deliveryAddress,
        o.payment_method as paymentMethod, o.payment_status as paymentStatus,
        o.estimated_delivery_time as estimatedDeliveryTime, o.created_at as createdAt,
        r.name as restaurantName, r.image_url as restaurantImage
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.id = ? AND o.user_id = ?
    `,
      )
      .get(id, userId) as any;

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      } as ApiResponse);
    }

    // Get order items
    const orderItems = db
      .prepare(
        `
      SELECT
        oi.id, oi.order_id as orderId, oi.menu_item_id as menuItemId,
        oi.quantity, oi.price,
        mi.name as name, mi.description, mi.image_url as imageUrl
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE oi.order_id = ?
    `,
      )
      .all(id) as any[];

    res.json({
      success: true,
      message: "Order fetched successfully",
      data: {
        ...order,
        estimatedDeliveryTime: new Date(
          order.estimatedDeliveryTime,
        ).toISOString(),
        items: orderItems,
      },
    } as ApiResponse<Order>);
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse);
  }
};

// Update order status (for admin/restaurant)
export const handleUpdateOrderStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      } as ApiResponse);
    }

    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      } as ApiResponse);
    }

    const result = db
      .prepare(
        `
      UPDATE orders
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      )
      .run(status, id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      } as ApiResponse);
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
    } as ApiResponse);
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse);
  }
};
