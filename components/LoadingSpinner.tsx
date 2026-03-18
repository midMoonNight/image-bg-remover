export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-16">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-20 h-20 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin"></div>
        {/* Inner ring */}
        <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-pink-500 animate-spin" style={{ animationDuration: '1.5s' }}></div>
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 animate-pulse"></div>
        </div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-white">AI 处理中...</p>
        <p className="text-sm text-purple-300/60">正在智能识别并去除背景</p>
      </div>
    </div>
  )
}
