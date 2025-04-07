# JSDelivr MIME 类型修复代理

这是一个用于修复 JSDelivr CDN 返回的 MIME 类型问题的代理服务。主要功能是：

- 对于 HTML 文件：反向代理并修改 MIME 类型为 `text/html`
- 对于其他文件：直接 301 重定向到上游 CDN

## 支持平台

- Cloudflare Workers
- Vercel
- Netlify
- Deno Deploy

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `UPSTREAM_URL` | 上游 CDN 地址 | `https://cdn.jsdelivr.net` |

## 本地开发

1. 安装依赖：

```bash
npm install
```

2. 配置环境变量（可选）：

```bash
# 复制环境变量示例文件
cp .env.example .env

# 编辑 .env 文件，设置你的环境变量
```

3. 启动本地开发服务器：

```bash
npm run dev
```

4. 测试服务：

```bash
# 测试 HTML 文件
curl -I http://localhost:8787/gh/alist-org/pdf.js@main/web/viewer.html

# 测试其他文件
curl -I http://localhost:8787/gh/alist-org/pdf.js@main/web/viewer.js
```

## 部署指南

### Cloudflare Workers

1. 安装 Wrangler CLI：

```bash
npm install -g wrangler
```

2. 登录 Cloudflare：

```bash
wrangler login
```

3. 配置环境变量（可选）：

```bash
# 在 wrangler.toml 中设置
[vars]
UPSTREAM_URL = "https://cdn.jsdelivr.net"
```

4. 部署：

```bash
npm run deploy:cf
```

5. 配置自定义域名（可选）：

```bash
wrangler route add your-domain.com/*
```

### Vercel

1. 安装 Vercel CLI：

```bash
npm install -g vercel
```

2. 登录 Vercel：

```bash
vercel login
```

3. 配置环境变量（可选）：

```bash
# 在 Vercel 控制台或 .env 文件中设置
UPSTREAM_URL=https://cdn.jsdelivr.net
```

4. 部署：

```bash
npm run deploy:vercel
```

5. 配置自定义域名：
   - 在 Vercel 控制台添加域名
   - 按照指引配置 DNS 记录

### Netlify

1. 安装 Netlify CLI：

```bash
npm install -g netlify-cli
```

2. 登录 Netlify：

```bash
netlify login
```

3. 初始化项目：

```bash
netlify init
```

4. 配置环境变量（可选）：

```bash
# 在 Netlify 控制台或 .env 文件中设置
UPSTREAM_URL=https://cdn.jsdelivr.net
```

5. 部署：

```bash
npm run deploy:netlify
```

6. 配置自定义域名：
   - 在 Netlify 控制台添加域名
   - 按照指引配置 DNS 记录

### Deno Deploy

1. 安装 Deno：

```bash
# macOS/Linux
curl -fsSL https://deno.land/x/install/install.sh | sh

# Windows (PowerShell)
irm https://deno.land/install.ps1 | iex
```

2. 安装 Deno Deploy CLI：

```bash
deno install -A -f -n deployctl https://deno.land/x/deploy/deployctl.ts
```

3. 配置环境变量（可选）：

```bash
# 在部署时设置
export UPSTREAM_URL=https://cdn.jsdelivr.net
```

4. 部署：

```bash
npm run deploy:deno
```

## 配置说明

### Cloudflare Workers

- 配置文件：`wrangler.toml`
- 入口文件：`worker.js`

### Vercel

- 配置文件：`vercel.json`
- 入口文件：`api/index.js`

### Netlify

- 配置文件：`netlify.toml`
- 入口文件：`netlify/functions/index.js`

### Deno

- 入口文件：`deno.js`

## 注意事项

1. 所有平台都支持自定义域名配置
2. 建议根据访问量选择合适的平台：
   - 高访问量：Cloudflare Workers（免费额度最大）
   - 简单部署：Vercel/Netlify（配置简单）
   - 开发体验：Deno（原生 TypeScript 支持）
3. 可以通过环境变量 `UPSTREAM_URL` 修改上游 CDN 地址

## 故障排除

1. 如果遇到 CORS 问题：

   - 检查请求头是否正确设置
   - 确认 OPTIONS 请求是否正确处理

2. 如果遇到 MIME 类型问题：

   - 确认 HTML 文件的 Content-Type 是否正确设置为 `text/html; charset=utf-8`
   - 检查响应头是否被正确转发

3. 如果遇到重定向问题：
   - 确认 301 重定向 URL 是否正确
   - 检查重定向状态码是否为 301
   - 检查 `UPSTREAM_URL` 环境变量是否正确设置

## 贡献指南

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -am 'Add some feature'`
4. 推送分支：`git push origin feature/your-feature`
5. 提交 Pull Request

## 许可证

MIT
