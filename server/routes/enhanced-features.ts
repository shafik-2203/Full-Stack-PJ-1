import { RequestHandler } from "express";
import { db } from "../database";
import {
  MENU_CATEGORIES,
  ENHANCED_MENU_ITEMS,
  FOOD_FILTERS,
  SORT_OPTIONS,
} from "../utils/menu-categories";
import {
  PASS_PLANS,
  COINS_CONFIG,
  CANCELLATION_CONFIG,
  calculateCoinsEarned,
  checkPassBenefits,
  calculateCancellationCharge,
} from "../utils/fastio-pass";

// Get menu categories with current time suggestions
export const handleGetMenuCategories: RequestHandler = async (req, res) => {
  try {
    const now = new Date();
    const hour = now.getHours();

    // Determine current category based on time
    let currentCategory = "snacks";
    if (hour >= 6 && hour < 11) currentCategory = "breakfast";
    else if (hour >= 10 && hour < 15) currentCategory = "brunch";
    else if (hour >= 11 && hour < 16) currentCategory = "lunch";
    else if (hour >= 17 && hour < 24) currentCategory = "dinner";

    res.json({
      success: true,
      categories: MENU_CATEGORIES,
      currentCategory,
      enhancedMenuItems: ENHANCED_MENU_ITEMS,
    });
  } catch (error) {
    console.error("Error fetching menu categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch menu categories",
    });
  }
};

// Get filter options and sorting
export const handleGetFilterOptions: RequestHandler = async (req, res) => {
  try {
    res.json({
      success: true,
      filters: FOOD_FILTERS,
      sortOptions: SORT_OPTIONS,
    });
  } catch (error) {
    console.error("Error fetching filter options:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch filter options",
    });
  }
};

// Get user's FASTIO Pass status
export const handleGetUserPass: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check if user has an active pass
    const pass = db
      .prepare(
        `
      SELECT * FROM user_passes 
      WHERE user_id = ? AND status = 'active' AND expiry_date > datetime('now')
      ORDER BY created_at DESC LIMIT 1
    `,
      )
      .get(userId);

    if (pass) {
      res.json({
        success: true,
        pass: {
          ...pass,
          benefits:
            PASS_PLANS[pass.plan_type as keyof typeof PASS_PLANS].benefits,
        },
      });
    } else {
      res.json({
        success: true,
        pass: null,
      });
    }
  } catch (error) {
    console.error("Error fetching user pass:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pass information",
    });
  }
};

// Get user's FASTIO Coins
export const handleGetUserCoins: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Get user's coins balance
    const coins = db
      .prepare(
        `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'earned' THEN amount ELSE 0 END), 0) as earned_total,
        COALESCE(SUM(CASE WHEN type = 'spent' THEN amount ELSE 0 END), 0) as spent_total
      FROM coin_transactions 
      WHERE user_id = ? AND expiry_date > datetime('now')
    `,
      )
      .get(userId) as any;

    const balance = (coins?.earned_total || 0) - (coins?.spent_total || 0);

    // Get recent transactions
    const transactions = db
      .prepare(
        `
      SELECT * FROM coin_transactions 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 20
    `,
      )
      .all(userId);

    res.json({
      success: true,
      coins: {
        balance,
        earnedTotal: coins?.earned_total || 0,
        spentTotal: coins?.spent_total || 0,
        transactions,
      },
    });
  } catch (error) {
    console.error("Error fetching user coins:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch coins information",
    });
  }
};

// Subscribe to FASTIO Pass
export const handlePassSubscription: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const { planType } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!PASS_PLANS[planType as keyof typeof PASS_PLANS]) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan type",
      });
    }

    const plan = PASS_PLANS[planType as keyof typeof PASS_PLANS];

    // Create pass subscription (this would integrate with payment processing)
    const passId = `pass_${Date.now()}_${userId}`;
    const startDate = new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setDate(expiryDate.getDate() + plan.duration);

    // In a real implementation, you'd process payment first
    // For now, we'll create the pass directly

    db.prepare(
      `
      INSERT INTO user_passes (
        id, user_id, plan_type, status, start_date, expiry_date, 
        max_orders, orders_used, coins_earned
      ) VALUES (?, ?, ?, 'active', ?, ?, ?, 0, 0)
    `,
    ).run(
      passId,
      userId,
      planType,
      startDate.toISOString(),
      expiryDate.toISOString(),
      plan.maxOrders,
    );

    res.json({
      success: true,
      message: "Pass subscription successful",
      pass: {
        id: passId,
        planType,
        status: "active",
        startDate: startDate.toISOString(),
        expiryDate: expiryDate.toISOString(),
        maxOrders: plan.maxOrders,
        ordersUsed: 0,
      },
    });
  } catch (error) {
    console.error("Error subscribing to pass:", error);
    res.status(500).json({
      success: false,
      message: "Failed to subscribe to pass",
    });
  }
};

// Get order cancellation information
export const handleGetCancellationInfo: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const { orderId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Get order details
    const order = db
      .prepare(
        `
      SELECT * FROM orders 
      WHERE id = ? AND user_id = ?
    `,
      )
      .get(orderId, userId) as any;

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Calculate cancellation info
    const orderTime = new Date(order.created_at);
    const now = new Date();
    const minutesSinceOrder = Math.floor(
      (now.getTime() - orderTime.getTime()) / (1000 * 60),
    );

    let minutesSinceConfirmation;
    if (order.confirmed_at) {
      const confirmTime = new Date(order.confirmed_at);
      minutesSinceConfirmation = Math.floor(
        (now.getTime() - confirmTime.getTime()) / (1000 * 60),
      );
    }

    const cancellationInfo = calculateCancellationCharge(
      order.total_amount,
      order.status,
      minutesSinceOrder,
      minutesSinceConfirmation,
    );

    // Calculate time remaining for free cancellation
    let timeRemaining = 0;
    if (order.status === "pending" || order.status === "confirmed") {
      const freeWindow =
        order.status === "pending"
          ? CANCELLATION_CONFIG.freeWindows.beforeConfirmation
          : CANCELLATION_CONFIG.freeWindows.afterConfirmation;

      const baseTime =
        order.status === "pending"
          ? orderTime.getTime()
          : new Date(order.confirmed_at || order.created_at).getTime();

      const freeUntil = baseTime + freeWindow * 60 * 1000;
      timeRemaining = Math.max(
        0,
        Math.floor((freeUntil - now.getTime()) / 1000),
      );
    }

    res.json({
      success: true,
      ...cancellationInfo,
      timeRemaining,
      order: {
        id: order.id,
        status: order.status,
        totalAmount: order.total_amount,
        createdAt: order.created_at,
        confirmedAt: order.confirmed_at,
      },
    });
  } catch (error) {
    console.error("Error getting cancellation info:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get cancellation information",
    });
  }
};

// Cancel order
export const handleCancelOrder: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const { orderId } = req.params;
    const { refundMethod } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Get order details
    const order = db
      .prepare(
        `
      SELECT * FROM orders 
      WHERE id = ? AND user_id = ?
    `,
      )
      .get(orderId, userId) as any;

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status === "cancelled" || order.status === "delivered") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled",
      });
    }

    // Calculate cancellation charge
    const orderTime = new Date(order.created_at);
    const now = new Date();
    const minutesSinceOrder = Math.floor(
      (now.getTime() - orderTime.getTime()) / (1000 * 60),
    );

    const cancellationInfo = calculateCancellationCharge(
      order.total_amount,
      order.status,
      minutesSinceOrder,
    );

    if (!cancellationInfo.canCancel) {
      return res.status(400).json({
        success: false,
        message: cancellationInfo.reason,
      });
    }

    // Update order status
    db.prepare(
      `
      UPDATE orders 
      SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `,
    ).run(orderId);

    // Process refund (simplified - in real app, integrate with payment processor)
    const refundAmount = order.total_amount - cancellationInfo.charge;

    if (refundAmount > 0) {
      if (refundMethod === "coins") {
        // Add coins to user account
        const transactionId = `refund_${Date.now()}_${userId}`;
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);

        db.prepare(
          `
          INSERT INTO coin_transactions (
            id, user_id, type, amount, reason, order_id, expiry_date
          ) VALUES (?, ?, 'earned', ?, 'Order cancellation refund', ?, ?)
        `,
        ).run(
          transactionId,
          userId,
          refundAmount,
          orderId,
          expiryDate.toISOString(),
        );
      }
      // For original payment method, integrate with payment processor
    }

    res.json({
      success: true,
      message: "Order cancelled successfully",
      refund: {
        amount: refundAmount,
        method: refundMethod,
        charge: cancellationInfo.charge,
      },
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  }
};
