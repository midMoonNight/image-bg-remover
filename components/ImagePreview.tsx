'use client'

interface ImagePreviewProps {
  originalImage: string
  resultImage: string | null
  onDownload: () => void
}

export default function ImagePreview({ originalImage, resultImage, onDownload }: ImagePreviewProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 原图 */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600">原图</h3>
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            <img
              src={originalImage}
              alt="Original"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* 结果 */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600">去背景结果</h3>
          <div 
            className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
                linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
                linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)
              `,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
            }}
          >
            {resultImage ? (
              <img
                src={resultImage}
                alt="Result"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span>等待处理...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 下载按钮 */}
      {resultImage && (
        <div className="flex justify-center">
          <button
            onClick={onDownload}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span>下载 PNG</span>
          </button>
        </div>
      )}
    </div>
  )
}
