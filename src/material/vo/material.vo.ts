import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class MaterialVo {
  @ApiProperty({ description: 'Material id', example: 1 })
  @IsNumber()
  id: number;

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

  @ApiProperty({
    description: 'Material created time',
    example: '2022-10-08T21:10:59.000Z',
  })
  @IsDate()
  created_time: Date;

  @ApiProperty({
    description: 'Material updated time',
    example: '2022-10-08T21:10:59.000Z',
  })
  @IsDate()
  updated_time: Date;
}
