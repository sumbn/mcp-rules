import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard.js';
import { AuthService } from './auth.service.js';

/**
 * AuthModule — Module xác thực, có thể bật/tắt qua environment variables.
 *
 * Environment Variables:
 *   MCP_AUTH_ENABLED=false  → Không yêu cầu xác thực (mặc định cho MVP)
 *   MCP_AUTH_ENABLED=true   → Bắt buộc Bearer Token
 *   MCP_AUTH_TOKEN          → Token xác thực khi MCP_AUTH_ENABLED=true
 */
@Module({
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
