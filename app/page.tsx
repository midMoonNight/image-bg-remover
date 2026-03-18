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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex flex-col">
      {/* Header */}
      <header className="px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-sm">RemoveBG</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 py-4 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          {/* Title */}
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold text-white mb-1">一键去除图片背景</h1>
            <p className="text-white/70 text-xs">AI 智能识别，5 秒完成</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-3 p-2 bg-red-500/30 rounded text-xs text-white text-center">
              {error}
            </div>
          )}

          {/* Upload / Result */}
          {!originalImage ? (
            <label className="block bg-white rounded-xl cursor-pointer">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                <div className="w-8 h-8 mx-auto mb-2 text-gray-400">
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-gray-700 text-sm font-medium mb-1">点击或拖拽上传图片</p>
                <p className="text-gray-400 text-xs">JPG/PNG/WEBP · 最大5MB</p>
              </div>
            </label>
          ) : isProcessing ? (
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="w-8 h-8 mx-auto border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="mt-3 text-gray-600 text-sm">AI 处理中...</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-3 space-y-3">
              {/* Images */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500 mb-1">原图</p>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img src={originalImage} className="w-full h-full object-contain" alt="" />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">结果</p>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden" style={{backgroundImage: 'linear-gradient(45deg,#e5e7eb 25%,transparent 25%),linear-gradient(-45deg,#e5e7eb 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e5e7eb 75%),linear-gradient(-45deg,transparent 75%,#e5e7eb 75%)',backgroundSize:'16px 16px'}}>
                    {resultImage ? (
                      <img src={resultImage} className="w-full h-full object-contain" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">失败</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                {resultImage && (
                  <button
                    onClick={handleDownload}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                  >
                    下载 PNG
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
                >
                  新图片
                </button>
              </div>
            </div>
          )}

          {/* Features - Compact */}
          <div className="mt-6 flex justify-center space-x-6 text-center text-white text-xs">
            <div>
              <p className="font-medium">极速处理</p>
              <p className="text-white/60">5秒完成</p>
            </div>
            <div>
              <p className="font-medium">高清输出</p>
              <p className="text-white/60">保留质量</p>
            </div>
            <div>
              <p className="font-medium">隐私安全</p>
              <p className="text-white/60">自动删除</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-3 text-white/40 text-xs shrink-0">
        © 2026 RemoveBG
      </footer>
    </div>
  )
}
