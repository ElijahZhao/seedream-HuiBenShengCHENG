export async function POST(request: Request) {
  const apiKey = request.headers.get('x-api-key');
  if (!apiKey) {
    return Response.json({ error: 'Missing API key' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Call Volcengine API to generate image
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      return Response.json({ error: text }, { status: response.status });
    }

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url;

    if (!imageUrl) {
      return Response.json({ error: 'No image URL returned' }, { status: 500 });
    }

    // Download image and convert to base64 (URL expires, base64 is permanent)
    const imgResp = await fetch(imageUrl);
    if (!imgResp.ok) {
      return Response.json({ error: 'Failed to download generated image' }, { status: 500 });
    }

    const imgBuffer = await imgResp.arrayBuffer();
    const base64 = Buffer.from(imgBuffer).toString('base64');
    const mimeType = imgResp.headers.get('content-type') || 'image/png';

    return Response.json({
      data: [{
        url: imageUrl,
        base64: `data:${mimeType};base64,${base64}`,
      }]
    });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
