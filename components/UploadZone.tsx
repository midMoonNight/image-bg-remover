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
        relative rounded-2xl p-6 text-center cursor-pointer
        transition-all duration-200
        border-2
        ${isDragOver 
          ? 'border-blue-400 bg-blue-500/10' 
          : 'border-gray-600 bg-gray-800/40 hover:border-gray-500 hover:bg-gray-800/60'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInput}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      {/* Inner dashed border */}
      <div className={`
        rounded-xl border-2 border-dashed p-6 transition-colors
        ${isDragOver ? 'border-blue-400/60' : 'border-gray-600/60'}
      `}>
        <div className="space-y-3">
          {/* Upload icon */}
          <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25z" />
            </svg>
          </div>
          
          <div>
            <p className="text-base font-medium text-white">
              拖拽图片到此处
            </p>
            <p className="text-sm text-gray-400 mt-1">
              或点击上传
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <span>支持 JPG, PNG, WEBP</span>
            <span className="text-gray-600">·</span>
            <span>最大 5MB</span>
          </div>
        </div>
      </div>
    </div>
  )
}
