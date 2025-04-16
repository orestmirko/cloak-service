import { Injectable, Logger } from '@nestjs/common';
import { CheckRequestDto, CheckResponseDto } from '@dtos';
import { TrafficFilterResult } from '@interfaces';
import { RequestLogRepository } from 'src/core/database/repositories/request-log.repository';
import { 
    FrequencyFilterService, 
    IpFilterService, 
    ReferrerFilterService, 
    UserAgentFilterService
} from './filters';

@Injectable()
export class CloakService {
  private readonly logger = new Logger(CloakService.name);

  constructor(
    private readonly requestLogRepository: RequestLogRepository,

    private readonly ipFilterService: IpFilterService,
    private readonly userAgentFilterService: UserAgentFilterService,
    private readonly referrerFilterService: ReferrerFilterService,
    private readonly frequencyFilterService: FrequencyFilterService,
  ) {}

  async checkTraffic(checkData: CheckRequestDto): Promise<CheckResponseDto> {
    this.logger.debug(`Check traffic: ${JSON.stringify(checkData)}`);
    
    const filterResults = await Promise.all([
      this.ipFilterService.check(checkData),
      this.userAgentFilterService.check(checkData),
      this.referrerFilterService.check(checkData),
      this.frequencyFilterService.check(checkData),
    ]);
    
    const botResult = filterResults.find(result => result.isBot);
    
    const result = botResult ? 'bot' : 'not bot';
    const response: CheckResponseDto = { result };
    
    await this.logRequest(checkData, result, botResult?.reason, filterResults);
    
    return response;
  }

  private async logRequest(
    request: CheckRequestDto,
    result: string,
    reason?: string,
    filterResults?: TrafficFilterResult[],
  ): Promise<void> {
    try {
      const { ip, userAgent, referrer } = request;    
      await this.requestLogRepository.create({
        ip,
        userAgent,
        referrer,
        result,
        details: {
          reason,
          filterResults,
        },
      });
    } catch (error) {
      this.logger.error(`Error logging request: ${error.message}`);
    }
  }
} 