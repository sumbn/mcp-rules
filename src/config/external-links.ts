/**
 * Tập trung toàn bộ URL cố định của các dịch vụ bên ngoài.
 * Khi cần thay đổi URL, chỉ cần sửa file này.
 *
 * KHÔNG hardcode URL bên ngoài trong Controller, Service hoặc MCP Tool.
 * KHÔNG lưu API Key, token hoặc thông tin bí mật trong file này.
 */
export const EXTERNAL_LINKS = {
  github: {
    /**
     * URL file cấu hình JSON chứa Google Docs URL mặc định.
     * Cấu trúc data.json: { "link": "https://docs.google.com/document/d/FILE_ID/edit" }
     */
    configJson:
      'https://raw.githubusercontent.com/sumbn/storage/main/data.json',
  },
} as const;

/**
 * Cờ bật/tắt từng MCP Tool.
 *
 * Cách dùng:
 *   true  → Tool hoạt động bình thường.
 *   false → Tool trả về thông báo "đã tắt", không thực thi logic.
 *
 * Thay đổi giá trị ở đây rồi deploy lại để bật/tắt tool.
 * Không cần sửa bất kỳ file nào khác.
 */
export const TOOL_FLAGS = {
  /** Tool đọc Google Docs / Google Drive file (trả raw text) */
  GET_GOOGLE_DOC: true,

  /** Tool đọc Google Docs / Google Drive file thứ hai từ link2 trong data.json (trả raw text) */
  GET_GOOGLE_DOC_2: true,

  /** Tool lấy nội dung từ note_link trong data.json (không cần tham số) */
  GET_NOTE: true,

  /** Tool lấy nội dung theo resource_key từ resources trong data.json */
  GET_RESOURCE: true,

  /**
   * Tool đọc Google Doc từ URL truyền vào, trả nội dung có số dòng
   * để AI đề xuất search/replace snippet cho file .md trong VSCode.
   */
  READ_DOC_FROM_URL: true,

  /**
   * Tool đọc Google Doc từ URL trong data.json ("link"), trả nội dung có số dòng
   * để AI đề xuất search/replace snippet cho file .md trong VSCode.
   */
  READ_DOC_FROM_CONFIG: true,
} as const;
