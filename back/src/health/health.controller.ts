import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from "@nestjs/terminus/index";
import { ApiOperation } from "@nestjs/swagger";

@Controller('health')
export class HealthController {
  constructor(private _health: HealthCheckService,
              private _dns: HttpHealthIndicator) {}

  @Get()
  @HealthCheck()
  @ApiOperation({summary: 'Etat de santé du serveur'})
  check() {
    return this._health.check([
      () => this._dns.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }
}
