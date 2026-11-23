var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { GithubConfigModule } from '../github-config/github-config.module.js';
import { GoogleDocsService } from './google-docs.service.js';
let GoogleDocsModule = class GoogleDocsModule {
};
GoogleDocsModule = __decorate([
    Module({
        imports: [GithubConfigModule],
        providers: [GoogleDocsService],
        exports: [GoogleDocsService],
    })
], GoogleDocsModule);
export { GoogleDocsModule };
//# sourceMappingURL=google-docs.module.js.map