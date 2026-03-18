'use client'

import { useState, useCallback } from 'react'
import UploadZone from '@/components/UploadZone'
import LoadingSpinner from '@/components/LoadingSpinner'
import ImagePreview from '@/components/ImagePreview'

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return '不支持的文件格式，请上传 JPG、PNG 或 WEBP 图片'
    }
    if (file.size > 5 * 1024 * 1024) {
      return '图片大小超过 5MB 限制'
    }
    return null
  }

  const handleFileSelect = useCallback(async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '处理失败')
      }

      setResultImage(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理过程中出现错误')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = useCallback(() => {
    if (!resultImage) return
    
    const link = document.createElement('a')
    link.href = resultImage
    link.download = `removed-bg-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [resultImage])

  const handleReset = useCallback(() => {
    setOriginalImage(null)
    setResultImage(null)
    setError(null)
    setIsProcessing(false)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-indigo-950 py-4 px-3">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 mb-2 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-1">
            图片去背景
          </h1>
          <p className="text-xs text-gray-400">
            一键去除图片背景，AI 智能识别
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-3 p-2.5 bg-red-500/20 border border-red-500/40 rounded-lg">
            <div className="flex items-center space-x-2 text-red-300 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Upload Zone */}
        {!originalImage && (
          <UploadZone 
            onFileSelect={handleFileSelect} 
            disabled={isProcessing}
          />
        )}

        {/* Processing */}
        {isProcessing && <LoadingSpinner />}

        {/* Result Preview */}
        {originalImage && !isProcessing && (
          <div className="space-y-3">
            <ImagePreview
              originalImage={originalImage}
              resultImage={resultImage}
              onDownload={handleDownload}
            />
            
            {/* Reset Button */}
            <div className="flex justify-center pt-1">
              <button
                onClick={handleReset}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 text-xs font-medium rounded-full transition-all duration-200 border border-gray-600/50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <span>处理新图片</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-6 text-center text-xs text-gray-500">
          <p>© 2026 Image Background Remover · Powered by Remove.bg</p>
        </footer>
      </div>
    </main>
  )
}
