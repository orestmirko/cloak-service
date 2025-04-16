import { ApiProperty } from '@nestjs/swagger';

export class CheckResponseDto {
  @ApiProperty({
    description: 'Result of check: "bot" or "not bot"',
    example: 'not bot',
    enum: ['bot', 'not bot'],
  })
  result: string;
} 