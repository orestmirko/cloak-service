import { Injectable, Logger } from '@nestjs/common';
import { TrafficFilter, TrafficFilterResult } from '@interfaces';
import { CheckRequestDto } from '@dtos';
import { RequestLogRepository } from '@repositories';

@Injectable()
export class FrequencyFilterService implements TrafficFilter {
  private readonly logger = new Logger(FrequencyFilterService.name);
  
  private readonly MAX_REQUESTS = 30;
  private readonly TIME_WINDOW = 60;

  constructor(
    private readonly requestLogRepository: RequestLogRepository,
  ) {}

  async check(request: CheckRequestDto): Promise<TrafficFilterResult> {
    const { ip } = request;
    
    try {
      const timeThreshold = new Date();
      timeThreshold.setSeconds(timeThreshold.getSeconds() - this.TIME_WINDOW);
      
      const requestCount = await this.requestLogRepository.countRecentByIp(ip, timeThreshold);
      
      if (requestCount >= this.MAX_REQUESTS) {
        return {
          isBot: true,
          reason: `Exceeded the request limit: ${requestCount} in ${this.TIME_WINDOW} seconds`,
        };
      }
      
      return { isBot: false };
    } catch (error) {
      this.logger.error(`Error checking request frequency for IP ${ip}: ${error.message}`);
      return { isBot: false };
    }
  }
} 