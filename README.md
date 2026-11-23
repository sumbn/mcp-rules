# Google Docs MCP Server

MCP Server đọc nội dung Google Docs công khai, xây dựng bằng **NestJS** + **@nestjs/mcp** với **Streamable HTTP Transport**, có thể deploy lên **Vercel Serverless**.

## MCP Tool

### `get_google_doc`

Đọc nội dung tài liệu Google Docs hoặc Google Drive file được chia sẻ công khai.

**Tham số:**

| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| `document_url` | `string` (URL) | Không | URL Google Docs/Drive. Nếu không truyền, dùng URL mặc định từ GitHub config. |

**Hành vi:**
- Nếu có `document_url` → đọc tài liệu từ URL đó.
- Nếu không có `document_url` → lấy URL từ [data.json trên GitHub](https://raw.githubusercontent.com/sumbn/storage/main/data.json).
- Nếu URL được truyền nhưng lỗi → trả lỗi, **không fallback** sang tài liệu mặc định.

**URL được hỗ trợ:**
- `https://docs.google.com/document/d/{FILE_ID}/edit` — Google Docs
- `https://drive.google.com/file/d/{FILE_ID}/view` — Google Drive file
- `https://drive.google.com/open?id={FILE_ID}` — Google Drive link

## Cài đặt & Chạy local

```bash
# Cài dependencies
npm install --legacy-peer-deps

# Copy file cấu hình môi trường
cp .env.example .env

# Chạy development server
npm run start:dev
```

MCP endpoint: `http://localhost:3000/mcp`

## Cấu hình

Tạo file `.env` từ `.env.example`:

```env
# Tắt auth (mặc định cho MVP)
MCP_AUTH_ENABLED=false
MCP_AUTH_TOKEN=your-secret-token-here
PORT=3000
```

### Bật Authentication

```env
MCP_AUTH_ENABLED=true
MCP_AUTH_TOKEN=my-strong-random-token-32chars
```

Khi bật, mọi request phải có header:
```
Authorization: Bearer my-strong-random-token-32chars
```

## Cấu hình Google Docs URL mặc định

Thay đổi URL trong file `data.json` trên GitHub (không cần deploy lại server):

```json
{
  "link": "https://docs.google.com/document/d/YOUR_FILE_ID/edit"
}
```

> ⚠️ Tài liệu phải được chia sẻ **công khai** (Anyone with the link can view).

## Deploy lên Vercel

```bash
# Cài Vercel CLI
npm i -g vercel

# Deploy
vercel

# Hoặc kết nối GitHub repo và auto-deploy
```

**Environment Variables trên Vercel:**
- `MCP_AUTH_ENABLED`
- `MCP_AUTH_TOKEN`

## Cấu trúc dự án

```
src/
├── config/
│   └── external-links.ts      # URL cố định của dịch vụ bên ngoài
├── auth/
│   ├── auth.module.ts          # Auth module
│   ├── auth.guard.ts           # Bearer Token guard (bật/tắt qua env)
│   └── auth.service.ts         # Token validation
├── google-docs/
│   ├── google-docs.module.ts
│   └── google-docs.service.ts  # Fetch & parse Google Docs
├── mcp-tools/
│   ├── mcp-tools.module.ts
│   └── get-google-doc.tool.ts  # MCP Tool: get_google_doc
├── app.module.ts               # Root module
└── main.ts                     # Entry point (local + Vercel)
```

## Test với MCP Inspector

```bash
npx @modelcontextprotocol/inspector http://localhost:3000/mcp
```

## Build

```bash
npm run build
```
