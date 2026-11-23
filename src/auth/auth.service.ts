import { Injectable } from '@nestjs/common';

/**
 * AuthService — kiểm tra Bearer Token.
 * Token được đọc từ environment variable MCP_AUTH_TOKEN.
 */
@Injectable()
export class AuthService {
  isTokenValid(token: string | undefined): boolean {
    const expectedToken = process.env.MCP_AUTH_TOKEN;
    if (!expectedToken) {
      // Nếu không cấu hình token thì không thể xác thực được ai
      return false;
    }
    return token === expectedToken;
  }

  isAuthEnabled(): boolean {
    return process.env.MCP_AUTH_ENABLED === 'true';
  }
}
