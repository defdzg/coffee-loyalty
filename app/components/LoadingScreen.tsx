'use client'

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      {/* Animated logo */}
      <div className="mb-8 animate-pulse">
        <div className="text-6xl">☕</div>
      </div>

      {/* Skeleton text */}
      <div className="space-y-3 text-center">
        <div className="h-4 w-32 bg-gray-200 rounded-lg mx-auto animate-pulse" />
        <div className="h-3 w-24 bg-gray-100 rounded-lg mx-auto animate-pulse" />
      </div>

      {/* Spinner */}
      <div className="mt-12">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    </div>
  )
}
