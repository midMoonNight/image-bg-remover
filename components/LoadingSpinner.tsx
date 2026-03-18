export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin-slow"></div>
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700">AI 处理中...</p>
        <p className="text-sm text-gray-500 mt-1">正在智能识别并去除背景</p>
      </div>
    </div>
  )
}
