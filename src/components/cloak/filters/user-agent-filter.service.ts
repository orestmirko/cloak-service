import { Injectable } from '@nestjs/common';
import { TrafficFilter, TrafficFilterResult } from '@interfaces';
import { CheckRequestDto } from '@dtos';

@Injectable()
export class UserAgentFilterService implements TrafficFilter {
  private readonly BOT_PATTERNS = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /googlebot/i,
    /bingbot/i,
    /yandex/i,
    /baidu/i,
    /curl/i,
    /wget/i,
    /postman/i,
    /insomnia/i,
    /python-requests/i,
    /axios/i,
    /node-fetch/i,
    /java/i,
  ];

  private readonly BROWSER_SIGNATURES = [
    'Mozilla/',
    'AppleWebKit/',
    'Chrome/',
    'Safari/',
    'Firefox/',
    'Edge/',
    'MSIE ',
  ];

  async check(request: CheckRequestDto): Promise<TrafficFilterResult> {
    const { userAgent } = request;
    
    if (!userAgent) {
      return {
        isBot: true,
        reason: 'User-Agent is absent',
      };
    }
    
    for (const pattern of this.BOT_PATTERNS) {
      if (pattern.test(userAgent)) {
        return {
          isBot: true,
          reason: `User-Agent contains bot signs: ${pattern}`,
        };
      }
    }
    
    const hasBrowserSignature = this.BROWSER_SIGNATURES.some(signature => 
      userAgent.includes(signature)
    );
    
    if (!hasBrowserSignature) {
      return {
        isBot: true,
        reason: 'User-Agent does not contain standard browser signs',
      };
    }

    return { isBot: false };
  }
} 