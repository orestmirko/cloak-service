import { ApiProperty } from '@nestjs/swagger';
import { IsIP, IsOptional, IsString } from 'class-validator';

export class CheckRequestDto {
  @ApiProperty({
    description: 'IP-address of user',
    example: '8.8.8.8',
  })
  @IsIP()
  ip: string;

  @ApiProperty({
    description: 'User-Agent header',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/113.0.0.0 Safari/537.36',
  })
  @IsString()
  userAgent: string;

  @ApiProperty({
    description: 'Referrer header',
    example: 'https://www.google.com/',
    required: false,
  })
  @IsString()
  @IsOptional()
  referrer?: string;
} 