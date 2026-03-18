export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-3 py-8">
      <div className="w-12 h-12 rounded-full border-3 border-gray-700 border-t-blue-500 animate-spin"></div>
      <div className="text-center space-y-0.5">
        <p className="text-sm font-medium text-white">AI 处理中...</p>
        <p className="text-xs text-gray-500">正在智能识别并去除背景</p>
      </div>
    </div>
  )
}
