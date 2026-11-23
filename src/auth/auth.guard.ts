import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service.js';

/**
 * AuthGuard — Guard bảo vệ MCP endpoint.
 *
 * Hành vi:
 * - Nếu MCP_AUTH_ENABLED=false (mặc định): pass through, không kiểm tra gì.
 * - Nếu MCP_AUTH_ENABLED=true: yêu cầu header "Authorization: Bearer <token>".
 *   Token phải khớp với MCP_AUTH_TOKEN trong environment variables.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    if (!this.authService.isAuthEnabled()) {
      // Auth bị tắt — cho phép tất cả requests
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header. Expected: Bearer <token>',
      );
    }

    const token = authHeader.slice('Bearer '.length).trim();

    if (!this.authService.isTokenValid(token)) {
      throw new UnauthorizedException('Invalid authentication token.');
    }

    return true;
  }
}
