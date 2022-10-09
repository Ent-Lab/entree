import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty({
    description: 'User token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQG5hdmVyLmNvbSIsImlhdCI6MTY2NTIzNzIxNX0.Z4z5ED1uablp6_lAVS9K_kVMnK0mdjIFbE72r7whZH4',
  })
  token: string;

  @ApiProperty({
    description: 'User token expired in time',
    example: '1h',
  })
  expiredIn: string;
}
