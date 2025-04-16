import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class RequestLog extends Document {
  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  userAgent: string;

  @Prop()
  referrer: string;

  @Prop({ required: true })
  result: string;

  @Prop({ type: Object })
  ipInfo: Record<string, any>;

  @Prop({ type: Object })
  details: Record<string, any>;
}

export const RequestLogSchema = SchemaFactory.createForClass(RequestLog); 