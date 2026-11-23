import { Module } from '@nestjs/common';
import { GithubConfigModule } from '../github-config/github-config.module.js';
import { GoogleDocsService } from './google-docs.service.js';

@Module({
  imports: [GithubConfigModule],
  providers: [GoogleDocsService],
  exports: [GoogleDocsService],
})
export class GoogleDocsModule {}
