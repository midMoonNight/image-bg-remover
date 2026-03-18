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
    <div className="min-h-screen bg-gray-900 text-white p-3">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-3">
          <h1 className="text-lg font-bold">图片去背景</h1>
          <p className="text-xs text-gray-400">AI 智能识别</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-2 p-2 bg-red-500/20 rounded text-xs text-red-300 text-center">
            {error}
          </div>
        )}

        {/* Upload */}
        {!originalImage && (
          <label className="block border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-gray-500">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
              </svg>
            </div>
            <p className="text-sm">点击或拖拽上传</p>
            <p className="text-xs text-gray-500 mt-1">JPG/PNG/WEBP · 最大5MB</p>
          </label>
        )}

        {/* Loading */}
        {isProcessing && (
          <div className="text-center py-6">
            <div className="w-8 h-8 mx-auto border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-xs text-gray-400 mt-2">处理中...</p>
          </div>
        )}

        {/* Result */}
        {originalImage && !isProcessing && (
          <div className="space-y-2">
            {/* Images */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-gray-500 mb-1">原图</p>
                <div className="aspect-square bg-gray-800 rounded overflow-hidden">
                  <img src={originalImage} className="w-full h-full object-contain" alt="" />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">结果</p>
                <div className="aspect-square bg-gray-800 rounded overflow-hidden" style={{backgroundImage: 'linear-gradient(45deg,#374151 25%,transparent 25%),linear-gradient(-45deg,#374151 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#374151 75%),linear-gradient(-45deg,transparent 75%,#374151 75%)',backgroundSize:'16px 16px',backgroundColor:'#1f2937'}}>
                  {resultImage ? (
                    <img src={resultImage} className="w-full h-full object-contain" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">处理中</div>
                  )}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              {resultImage && (
                <button
                  onClick={handleDownload}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium"
                >
                  下载 PNG
                </button>
              )}
              <button
                onClick={handleReset}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
              >
                新图片
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-4">Powered by Remove.bg</p>
      </div>
    </div>
  )
}
