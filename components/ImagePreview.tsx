'use client'

interface ImagePreviewProps {
  originalImage: string
  resultImage: string | null
  onDownload: () => void
}

export default function ImagePreview({ originalImage, resultImage, onDownload }: ImagePreviewProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 原图 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">原图</h3>
          </div>
          <div className="relative aspect-square bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700">
            <img
              src={originalImage}
              alt="Original"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* 结果 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">去背景结果</h3>
          </div>
          <div 
            className="relative aspect-square rounded-xl overflow-hidden border border-gray-700"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #374151 25%, transparent 25%),
                linear-gradient(-45deg, #374151 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #374151 75%),
                linear-gradient(-45deg, transparent 75%, #374151 75%)
              `,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              backgroundColor: '#1f2937'
            }}
          >
            {resultImage ? (
              <img
                src={resultImage}
                alt="Result"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600">
                <span className="text-sm">等待处理...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 下载按钮 */}
      {resultImage && (
        <div className="flex justify-center pt-2">
          <button
            onClick={onDownload}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-semibold rounded-full transition-all duration-200 shadow-lg shadow-blue-500/25"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span>下载 PNG</span>
          </button>
        </div>
      )}
    </div>
  )
}
