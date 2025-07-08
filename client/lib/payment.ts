
// Note: In production, this should be your actual Stripe publishable key
const stripePromise = loadStripe("pk_test_your_stripe_publishable_key_here");

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  type: "card" | "digital_wallet" | "bank_transfer" | "cash";
  enabled: boolean;
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: "stripe_card",
    name: "Credit/Debit Card",
    icon: "💳",
    type: "card",
    enabled: true,
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: "🅿️",
    type: "digital_wallet",
    enabled: true,
  },
  {
    id: "apple_pay",
    name: "Apple Pay",
    icon: "🍎",
    type: "digital_wallet",
    enabled: true,
  },
  {
    id: "google_pay",
    name: "Google Pay",
    icon: "🔵",
    type: "digital_wallet",
    enabled: true,
  },
  {
    id: "upi",
    name: "UPI (PhonePe/GPay/Paytm)",
    icon: "📱",
    type: "digital_wallet",
    enabled: true,
  },
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    icon: "🏦",
    type: "bank_transfer",
    enabled: true,
  },
  {
    id: "cash_on_delivery",
    name: "Cash on Delivery",
    icon: "💵",
    type: "cash",
    enabled: true,
  },
];

export interface PaymentDetails {
  amount: number;
  currency: string;
  paymentMethodId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  billingAddress: {
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export class PaymentService {
  private stripe: any = null;

  async initializeStripe() {
    if (!this.stripe) {
      this.stripe = await stripePromise;
    }
    return this.stripe;
  }

  // Simulate real payment processing
  async processPayment(paymentDetails: PaymentDetails): Promise<{
    success: boolean;
    paymentId?: string;
    error?: string;
  }> {
    const { paymentMethodId, amount } = paymentDetails;

    try {
      switch (paymentMethodId) {
        case "stripe_card":
          return await this.processCardPayment(paymentDetails);

        case "paypal":
          return await this.processPayPalPayment(paymentDetails);

        case "apple_pay":
        case "google_pay":
          return await this.processDigitalWalletPayment(paymentDetails);

        case "upi":
          return await this.processUPIPayment(paymentDetails);

        case "bank_transfer":
          return await this.processBankTransfer(paymentDetails);

        case "cash_on_delivery":
          return { success: true, paymentId: `cod_${Date.now()}` };

        default:
          return { success: false, error: "Payment method not supported" };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Payment failed",
      };
    }
  }

  private async processCardPayment(details: PaymentDetails) {
    // In a real implementation, you would:
    // 1. Create a payment intent on your backend
    // 2. Use Stripe.js to collect payment details
    // 3. Confirm the payment

    // For demo purposes, simulate payment processing
    await this.simulateProcessingDelay();

    // Simulate success/failure based on amount (for demo)
    if (details.amount > 1000) {
      return { success: false, error: "Insufficient funds" };
    }

    return {
      success: true,
      paymentId: `stripe_${Date.now()}`,
    };
  }

  private async processPayPalPayment(details: PaymentDetails) {
    await this.simulateProcessingDelay();
    return {
      success: true,
      paymentId: `paypal_${Date.now()}`,
    };
  }

  private async processDigitalWalletPayment(details: PaymentDetails) {
    await this.simulateProcessingDelay();
    return {
      success: true,
      paymentId: `wallet_${Date.now()}`,
    };
  }

  private async processUPIPayment(details: PaymentDetails) {
    // Simulate UPI payment flow
    await this.simulateProcessingDelay();

    // In real implementation, you would integrate with:
    // - Razorpay UPI
    // - Payu UPI
    // - Cashfree UPI
    // - Direct UPI APIs

    return {
      success: true,
      paymentId: `upi_${Date.now()}`,
    };
  }

  private async processBankTransfer(details: PaymentDetails) {
    await this.simulateProcessingDelay();
    return {
      success: true,
      paymentId: `bank_${Date.now()}`,
    };
  }

  private simulateProcessingDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 2000));
  }

  // Generate UPI payment link (for real UPI integration)
  generateUPILink(
    amount: number,
    merchantId: string,
    transactionId: string,
  ): string {
    const upiParams = new URLSearchParams({
      pa: merchantId, // UPI ID
      pn: "FASTIO",
      mc: "5411", // Merchant category code for restaurants
      tr: transactionId,
      tn: `FASTIO Order Payment`,
      am: amount.toString(),
      cu: "INR",
    });

    return `upi://pay?${upiParams.toString()}`;
  }

  // Bank transfer details (for manual bank transfers)
  getBankTransferDetails() {
    return {
      bankName: "FASTIO Bank Account",
      accountNumber: "1234567890",
      ifscCode: "FAST0001234",
      accountHolderName: "FASTIO Private Limited",
      branch: "Main Branch",
      instructions: [
        "Transfer the exact amount to the above account",
        "Use your order ID as reference",
        "Share payment screenshot with customer support",
        "Order will be confirmed after payment verification",
      ],
    };
  }
}

export const paymentService = new PaymentService();