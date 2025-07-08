export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-8">
          <div className="w-full h-full rounded-full border-4 border-white border-t-transparent animate-spin"></div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">FASTIO</h1>
        <p className="text-white/80">Loading your food experience...</p>
      </div>
    </div>
  );
}