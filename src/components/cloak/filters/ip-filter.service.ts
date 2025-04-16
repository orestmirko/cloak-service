import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { TrafficFilter, TrafficFilterResult } from '@interfaces';
import { CheckRequestDto } from '@dtos';
import { RedisService } from 'src/core/cache/redis.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IpFilterService implements TrafficFilter {
  private readonly logger = new Logger(IpFilterService.name);
  private readonly CACHE_TTL = 86400;

  constructor(
    private readonly httpService: HttpService,
    private readonly redisService: RedisService,
  ) {}

  async check(request: CheckRequestDto): Promise<TrafficFilterResult> {
    const { ip } = request;
    
    try {
      const ipInfo = await this.getIpInfo(ip);
      
      if (ipInfo.security && (ipInfo.security.vpn || ipInfo.security.proxy || ipInfo.security.tor)) {
        return {
          isBot: true,
          reason: `IP belongs to VPN/Proxy/Tor: ${JSON.stringify(ipInfo.security)}`,
        };
      }
      
      if (ipInfo.hosting && ipInfo.hosting.datacenter) {
        return {
          isBot: true,
          reason: `IP belongs to datacenter: ${ipInfo.hosting.datacenter}`,
        };
      }
      
      return { isBot: false };
    } catch (error) {
      this.logger.error(`Error checking IP ${ip}: ${error.message}`);
      return { isBot: false };
    }
  }

  private async getIpInfo(ip: string): Promise<any> {
    try {
      const cached = await this.redisService.get(`ip-info:${ip}`);
      if (cached) {
        return JSON.parse(cached);
      }
      
      const response = await firstValueFrom(
        this.httpService.get(`https://vpnapi.io/api/${ip}`),
      );

      await this.redisService.set(
        `ip-info:${ip}`,
        JSON.stringify(response.data),
        this.CACHE_TTL,
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error getting IP info: ${error.message}`);
      throw error;
    }
  }
} 