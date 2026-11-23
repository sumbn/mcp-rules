export function formatWithLineNumbers(options) {
    const { sourceUrl, content } = options;
    const lines = content.split('\n');
    const totalLines = lines.length;
    const pad = String(totalLines).length;
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
//# sourceMappingURL=format-with-line-numbers.util.js.map