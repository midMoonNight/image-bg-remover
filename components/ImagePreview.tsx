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
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <h3 className="text-sm font-medium text-purple-200">原图</h3>
          </div>
          <div className="relative aspect-square bg-white/5 rounded-xl overflow-hidden border border-white/10">
            <img
              src={originalImage}
              alt="Original"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* 结果 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-pink-500"></div>
            <h3 className="text-sm font-medium text-purple-200">去背景结果</h3>
          </div>
          <div 
            className="relative aspect-square rounded-xl overflow-hidden border border-white/10"
            style={{
              backgroundImage: `
                linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%),
                linear-gradient(-45deg, rgba(255,255,255,0.03) 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.03) 75%),
                linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.03) 75%)
              `,
              backgroundSize: '16px 16px',
              backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px'
            }}
          >
            {resultImage ? (
              <img
                src={resultImage}
                alt="Result"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-purple-400/50">
                <span>等待处理...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 下载按钮 */}
      {resultImage && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onDownload}
            className="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:animate-bounce">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span>下载 PNG</span>
          </button>
        </div>
      )}
    </div>
  )
}
