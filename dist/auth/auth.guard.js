var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException, } from '@nestjs/common';
import { AuthService } from './auth.service.js';
let AuthGuard = class AuthGuard {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    canActivate(context) {
        if (!this.authService.isAuthEnabled()) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing or invalid Authorization header. Expected: Bearer <token>');
        }
        const token = authHeader.slice('Bearer '.length).trim();
        if (!this.authService.isTokenValid(token)) {
            throw new UnauthorizedException('Invalid authentication token.');
        }
        return true;
    }
};
AuthGuard = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AuthService])
], AuthGuard);
export { AuthGuard };
//# sourceMappingURL=auth.guard.js.map