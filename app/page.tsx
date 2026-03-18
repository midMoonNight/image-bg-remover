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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-800">RemoveBG</span>
          </div>
          <nav className="hidden sm:flex items-center space-x-6 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-900">功能</a>
            <a href="#" className="hover:text-gray-900">价格</a>
            <a href="#" className="hover:text-gray-900">API</a>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            一键去除图片背景
          </h1>
          <p className="text-gray-500 text-base">
            AI 智能识别，5 秒完成，免费使用
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="max-w-md mx-auto mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        {/* Upload / Result */}
        <div className="max-w-2xl mx-auto">
          {!originalImage ? (
            <label className="block border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
              <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-700 mb-1">点击或拖拽上传图片</p>
              <p className="text-sm text-gray-400">支持 JPG、PNG、WEBP 格式，最大 5MB</p>
            </label>
          ) : isProcessing ? (
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center">
              <div className="w-10 h-10 mx-auto border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">AI 处理中...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Images */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">原图</p>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img src={originalImage} className="w-full h-full object-contain" alt="" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">去背景结果</p>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200" style={{backgroundImage: 'linear-gradient(45deg,#e5e7eb 25%,transparent 25%),linear-gradient(-45deg,#e5e7eb 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e5e7eb 75%),linear-gradient(-45deg,transparent 75%,#e5e7eb 75%)',backgroundSize:'20px 20px'}}>
                    {resultImage ? (
                      <img src={resultImage} className="w-full h-full object-contain" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">处理失败</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                {resultImage && (
                  <button
                    onClick={handleDownload}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    下载 PNG
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  处理新图片
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="w-10 h-10 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">极速处理</h3>
            <p className="text-sm text-gray-500">AI 5 秒完成背景去除</p>
          </div>
          <div>
            <div className="w-10 h-10 mx-auto mb-3 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">高清输出</h3>
            <p className="text-sm text-gray-500">保留原图质量</p>
          </div>
          <div>
            <div className="w-10 h-10 mx-auto mb-3 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">隐私安全</h3>
            <p className="text-sm text-gray-500">图片自动删除</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-16">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
          © 2026 RemoveBG. Powered by Remove.bg API
        </div>
      </footer>
    </div>
  )
}
