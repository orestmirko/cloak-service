import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestLog } from '@schemas';

@Injectable()
export class RequestLogRepository {
  constructor(
    @InjectModel(RequestLog.name) private requestLogModel: Model<RequestLog>,
  ) {}

  async create(data: Partial<RequestLog>): Promise<RequestLog> {
    const newLog = new this.requestLogModel(data);
    return newLog.save();
  }

  async findByIp(ip: string): Promise<RequestLog[]> {
    return this.requestLogModel.find({ ip }).exec();
  }

  async countRecentByIp(ip: string, timeThreshold: Date): Promise<number> {
    return this.requestLogModel.countDocuments({
      ip,
      createdAt: { $gte: timeThreshold },
    });
  }
} 