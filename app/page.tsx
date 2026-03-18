'use client'

import { useState, useCallback } from 'react'

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = useCallback(async (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('请上传 JPG、PNG 或 WEBP 图片')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('图片大小超过 5MB')
      return
    }

    setError(null)
    setResultImage(null)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      setOriginalImage(base64)
      processImage(base64)
    }
    reader.readAsDataURL(file)
  }, [])

  const processImage = async (base64Image: string) => {
    setIsProcessing(true)
    try {
      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || '处理失败')
      setResultImage(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理错误')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!resultImage) return
    const link = document.createElement('a')
    link.href = resultImage
    link.download = `removed-bg-${Date.now()}.png`
    link.click()
  }

  const handleReset = () => {
    setOriginalImage(null)
    setResultImage(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <span className="font-semibold text-gray-800">RemoveBG</span>
            <div className="flex space-x-4 text-sm">
              <a href="#" className="text-gray-500 hover:text-gray-700">功能</a>
              <a href="#" className="text-gray-500 hover:text-gray-700">价格</a>
              <a href="#" className="text-gray-500 hover:text-gray-700">API</a>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Title */}
            <div className="text-center mb-4">
              <h1 className="text-lg font-bold text-gray-800 mb-1">一键去除图片背景</h1>
              <p className="text-gray-500 text-xs">AI 智能识别，5 秒完成，免费使用</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-3 p-2 bg-red-50 rounded text-xs text-red-600 text-center">
                {error}
              </div>
            )}

            {/* Upload / Result */}
            {!originalImage ? (
              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-colors">
                  <p className="text-gray-700 text-sm font-medium">点击上传图片</p>
                  <p className="text-gray-400 text-xs mt-1">支持 JPG、PNG、WEBP 格式，最大 5MB</p>
                </div>
              </label>
            ) : isProcessing ? (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                <div className="w-6 h-6 mx-auto border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="mt-2 text-gray-600 text-sm">AI 处理中...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Images */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">原图</p>
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img src={originalImage} className="w-full h-full object-contain" alt="" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">去背景结果</p>
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden" style={{backgroundImage: 'linear-gradient(45deg,#e5e7eb 25%,transparent 25%),linear-gradient(-45deg,#e5e7eb 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e5e7eb 75%),linear-gradient(-45deg,transparent 75%,#e5e7eb 75%)',backgroundSize:'12px 12px'}}>
                      {resultImage ? (
                        <img src={resultImage} className="w-full h-full object-contain" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">处理失败</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-1">
                  {resultImage && (
                    <button
                      onClick={handleDownload}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      下载 PNG
                    </button>
                  )}
                  <button
                    onClick={handleReset}
                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    处理新图片
                  </button>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="mt-5 pt-4 border-t border-gray-100 flex justify-center space-x-6 text-center text-xs">
              <div>
                <p className="font-medium text-gray-700">极速处理</p>
                <p className="text-gray-400 mt-0.5">AI 5 秒完成</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">高清输出</p>
                <p className="text-gray-400 mt-0.5">保留原图质量</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">隐私安全</p>
                <p className="text-gray-400 mt-0.5">图片自动删除</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-xs mt-4">
          © 2026 RemoveBG · Powered by Remove.bg
        </p>
      </div>
    </div>
  )
}
