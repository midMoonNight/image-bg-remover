export async function POST(request: Request) {
  try {
    const { image } = await request.json()

    if (!image) {
      return Response.json(
        { success: false, error: '请提供图片' },
        { status: 400 }
      )
    }

    // 提取 base64 数据
    const base64Data = image.split(',')[1]
    if (!base64Data) {
      return Response.json(
        { success: false, error: '无效的图片格式' },
        { status: 400 }
      )
    }

    // 调用 Remove.bg API
    const apiKey = process.env.REMOVE_BG_API_KEY
    if (!apiKey) {
      return Response.json(
        { success: false, error: '服务配置错误，请联系管理员' },
        { status: 500 }
      )
    }

    const formData = new FormData()
    formData.append('image_file_b64', base64Data)
    formData.append('size', 'auto')

    const startTime = Date.now()
    
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: formData,
    })

    const processingTime = (Date.now() - startTime) / 1000

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Remove.bg API error:', errorData)
      return Response.json(
        { success: false, error: '去背景处理失败，请稍后重试' },
        { status: 500 }
      )
    }

    // 获取处理后的图片
    const resultBuffer = await response.arrayBuffer()
    const resultBase64 = Buffer.from(resultBuffer).toString('base64')
    const resultDataUrl = `data:image/png;base64,${resultBase64}`

    return Response.json({
      success: true,
      result: resultDataUrl,
      processingTime,
    })

  } catch (error) {
    console.error('Remove bg error:', error)
    return Response.json(
      { success: false, error: '处理过程中出现错误' },
      { status: 500 }
    )
  }
}
