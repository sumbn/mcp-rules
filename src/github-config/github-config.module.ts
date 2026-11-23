import { Module } from '@nestjs/common';
import { GithubConfigService } from './github-config.service.js';

@Module({
  providers: [GithubConfigService],
  exports: [GithubConfigService],
})
export class GithubConfigModule {}
