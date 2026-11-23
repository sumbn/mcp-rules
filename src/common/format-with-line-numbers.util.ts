/**
 * Định dạng nội dung văn bản thành dạng có số dòng,
 * phù hợp để AI phân tích và đề xuất search/replace snippet cho VSCode.
 *
 * Output mẫu:
 * ┌─────────────────────────────────────────────────────────┐
 * │  SOURCE: https://docs.google.com/...                    │
 * │  TOTAL : 42 lines                                       │
 * └─────────────────────────────────────────────────────────┘
 *
 *    1 │ # Heading 1
 *    2 │
 *    3 │ ## Section A
 *    4 │ Content here...
 *   ...
 */

export interface FormatOptions {
  /** URL nguồn tài liệu */
  sourceUrl: string;
  /** Nội dung raw text */
  content: string;
}

/**
 * Trả chuỗi đã được đánh số dòng + header metadata.
 * AI sẽ dùng số dòng này để tham chiếu khi đề xuất search/replace.
 */
export function formatWithLineNumbers(options: FormatOptions): string {
  const { sourceUrl, content } = options;
  const lines = content.split('\n');
  const totalLines = lines.length;
  const pad = String(totalLines).length; // độ rộng cột số dòng

  // Đánh số từng dòng
  const numbered = lines
    .map((line, i) => {
      const lineNo = String(i + 1).padStart(pad, ' ');
      return `${lineNo} │ ${line}`;
    })
    .join('\n');

  const separator = '─'.repeat(60);

  return [
    `┌${separator}┐`,
    `│  SOURCE : ${sourceUrl}`,
    `│  LINES  : ${totalLines} dòng`,
    `└${separator}┘`,
    '',
    numbered,
    '',
    `${separator}`,
    `HƯỚNG DẪN CHO AI:`,
    `Dựa vào nội dung và số dòng ở trên, hãy đề xuất các thay đổi`,
    `cho file .md cục bộ theo định dạng VSCode search/replace:`,
    ``,
    `SEARCH:`,
    `<text chính xác cần tìm trong file .md — phải khớp từng ký tự>`,
    ``,
    `REPLACE:`,
    `<nội dung thay thế>`,
    `${separator}`,
  ].join('\n');
}
