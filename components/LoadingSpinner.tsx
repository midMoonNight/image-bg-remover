export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 rounded-full border-3 border-gray-700 border-t-blue-500 animate-spin"></div>
      </div>
      <div className="text-center space-y-1">
        <p className="text-base font-medium text-white">AI 处理中...</p>
        <p className="text-sm text-gray-500">正在智能识别并去除背景</p>
      </div>
    </div>
  )
}
