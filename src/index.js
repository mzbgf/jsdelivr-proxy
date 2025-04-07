export async function handleRequest(request, env = {}) {
  try {
    const url = new URL(request.url);
    const path = url.pathname;

    // 从环境变量获取上游链接，默认为 jsdelivr
    const upstreamUrl = env.UPSTREAM_URL || 'https://jsd.onmicrosoft.cn';
    const jsdelivrUrl = `${upstreamUrl}${path}`;

    // 如果是 HTML 文件，进行反向代理并修改 MIME
    if (path.endsWith('.html')) {
      const response = await fetch(jsdelivrUrl, {
        headers: {
          'User-Agent': request.headers.get('User-Agent') || 'Mozilla/5.0',
          Accept: request.headers.get('Accept') || '*/*',
          'Accept-Language': request.headers.get('Accept-Language') || 'en-US,en;q=0.9',
        },
      });

      if (!response.ok) {
        return new Response(`Error: ${response.status} ${response.statusText}`, {
          status: response.status,
          statusText: response.statusText,
        });
      }

      const headers = new Headers(response.headers);
      headers.set('Content-Type', 'text/html; charset=utf-8');

      // 添加安全相关的响应头
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('X-Frame-Options', 'DENY');
      headers.set('Referrer-Policy', 'no-referrer-when-downgrade');

      // 设置缓存控制
      headers.set('Cache-Control', 'public, max-age=3600');

      // 添加 CORS 头
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Content-Type');

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers,
      });
    }

    // 处理 OPTIONS 请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // 对于其他文件，直接 301 重定向到上游
    return Response.redirect(jsdelivrUrl, 301);
  } catch (error) {
    // 错误处理
    return new Response(`Error: ${error.message}`, {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}
