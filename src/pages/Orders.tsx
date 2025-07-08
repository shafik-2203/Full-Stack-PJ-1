import { Package } from 'lucide-react';
import BackButton from "@/components/BackButton";

export default function Orders() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <BackButton to="/" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Orders</h1>
      <div className="text-center py-20">
        <Package size={64} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          No orders yet
        </h2>
        <p className="text-gray-600">
          Your order history will appear here once you place your first order.
        </p>
      </div>
    </div>
  );
}