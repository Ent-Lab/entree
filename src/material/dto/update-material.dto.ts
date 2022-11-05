import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateMaterialDto } from './create-material.dto';

export class UpdateMaterialDto extends PartialType(CreateMaterialDto) {
  @ApiProperty({ description: 'Material title', example: 'Rest API란?' })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Material summary',
    example:
      'RESTful API는 두 컴퓨터 시스템이 인터넷을 통해 정보를 안전하게 교환하기 위해 사용하는 인터페이스',
  })
  @IsString()
  summary: string;
}
