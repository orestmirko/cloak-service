import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CheckRequestDto, CheckResponseDto } from '@dtos';
import { CloakService } from '@providers';
import { Throttle } from '@decorators';

@ApiTags('Cloak Service')
@Controller('api/v1/cloak')
export class CloakController {
  constructor(private readonly cloakService: CloakService) {}

  @Post('check')
  @Throttle(10, 60)
  @ApiOperation({ summary: 'Check traffic for bot' })
  @ApiResponse({
    status: 200,
    description: 'Successful check',
    type: CheckResponseDto,
  })
  async checkTraffic(@Body() request: CheckRequestDto): Promise<CheckResponseDto> {
    return this.cloakService.checkTraffic(request);
  }
} 