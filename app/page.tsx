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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4 shadow-lg shadow-purple-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            图片去背景工具
          </h1>
          <p className="text-purple-200 text-base">
            一键去除图片背景，AI 智能识别
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-2 text-red-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
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
          <div className="space-y-6">
            <ImagePreview
              originalImage={originalImage}
              resultImage={resultImage}
              onDownload={handleDownload}
            />
            
            {/* Reset Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleReset}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <span>处理新图片</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-purple-300/60">
          <p>© 2026 Image Background Remover</p>
          <p className="mt-1">Powered by Remove.bg API</p>
        </footer>
      </div>
    </main>
  )
}
