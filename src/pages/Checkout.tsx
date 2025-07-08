import BackButton from "@/components/BackButton";

export default function Checkout() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <BackButton to="/cart" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
      <div className="text-center py-20">
        <p className="text-gray-600">Checkout functionality coming soon...</p>
      </div>
    </div>
  );
}
