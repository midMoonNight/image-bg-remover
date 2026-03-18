'use client'

import { useState, useCallback } from 'react'

interface UploadZoneProps {
  onFileSelect: (file: File) => void
  disabled?: boolean
}

export default function UploadZone({ onFileSelect, disabled }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      onFileSelect(files[0])
    }
  }, [onFileSelect])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onFileSelect(files[0])
    }
  }, [onFileSelect])

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative rounded-2xl p-8 sm:p-12 text-center cursor-pointer
        transition-all duration-300 ease-in-out
        border-2 border-dashed
        ${isDragOver 
          ? 'border-purple-400 bg-purple-500/20 scale-[1.02] shadow-lg shadow-purple-500/25' 
          : 'border-purple-500/40 bg-white/5 hover:border-purple-400/60 hover:bg-white/10'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        backdrop-blur-sm
      `}
    >
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInput}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className="space-y-4">
        <div className={`
          mx-auto w-20 h-20 rounded-full flex items-center justify-center
          transition-all duration-300
          ${isDragOver 
            ? 'bg-purple-500/30 scale-110' 
            : 'bg-purple-500/20'
          }
        `}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-purple-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25z" />
          </svg>
        </div>
        
        <div>
          <p className="text-lg font-medium text-white mb-1">
            拖拽图片到此处
          </p>
          <p className="text-sm text-purple-300/70">
            或点击上传
          </p>
        </div>
        
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
          <span className="text-xs text-purple-300/60">支持 JPG, PNG, WEBP</span>
          <span className="text-purple-500/40">|</span>
          <span className="text-xs text-purple-300/60">最大 5MB</span>
        </div>
      </div>
    </div>
  )
}
