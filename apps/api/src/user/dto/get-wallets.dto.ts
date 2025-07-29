import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class GetWalletsDto {
  @ApiProperty({
    description: 'Public key for authentication',
    example:
      '02a1633cafcc01ebfb6d78e39f687a1f0995c62fc95f51ead10a02ee0be551b5dc',
  })
  @IsString()
  @IsNotEmpty()
  publicKey: string;

  @ApiProperty({
    description:
      'Timestamp when the request was created (Unix timestamp in milliseconds)',
    example: 1704067200000,
  })
  @IsNumber()
  @Min(1)
  timestamp: number;

  @ApiProperty({
    description: 'Digital signature of the data',
    example: '3045022100...',
  })
  @IsString()
  @IsNotEmpty()
  signature: string;

  [key: string]: unknown;
}
