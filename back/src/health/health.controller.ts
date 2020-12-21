import { Controller, Get } from '@nestjs/common';
import { DNSHealthIndicator, HealthCheck, HealthCheckService } from "@nestjs/terminus/index";

@Controller('health')
export class HealthController {
  constructor(private _health: HealthCheckService,
              private _dns: DNSHealthIndicator) {}

  @Get()
  @HealthCheck()
  check() {
    return this._health.check([
      () => this._dns.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }
}
