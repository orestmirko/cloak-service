export interface TrafficFilterResult {
  isBot: boolean;
  reason?: string;
}

export interface TrafficFilter {
  check(request: any): Promise<TrafficFilterResult>;
} 