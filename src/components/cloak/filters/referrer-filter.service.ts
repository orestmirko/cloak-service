import { Injectable } from '@nestjs/common';
import { TrafficFilter, TrafficFilterResult } from '@interfaces';
import { CheckRequestDto } from '@dtos';

@Injectable()
export class ReferrerFilterService implements TrafficFilter {
  private readonly SUSPICIOUS_REFERRERS = [
    /facebook\.com\/ads/i,
    /google\.com\/ads/i,
    /adwords\.google/i,
    /adsmanager/i,
    /moderator/i,
    /review/i,
    /admin/i,
  ];

  async check(request: CheckRequestDto): Promise<TrafficFilterResult> {
    const { referrer } = request;
    
    if (!referrer) {
      return { isBot: false };
    }

    for (const pattern of this.SUSPICIOUS_REFERRERS) {
      if (pattern.test(referrer)) {
        return {
          isBot: true,
          reason: `Referrer contains suspicious pattern: ${pattern}`,
        };
      }
    }

    return { isBot: false };
  }
} 