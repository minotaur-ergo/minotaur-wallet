import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsHexadecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    description: 'Chain code for the user (32 bytes hex)',
    example:
      '873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d5080',
  })
  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @Length(64, 64, {
    message: 'chainCode must be exactly 32 bytes (64 hex characters)',
  })
  chainCode: string;

  @ApiProperty({
    description: 'Key data for the user (33 bytes hex)',
    example:
      '0339a36013301597daef41fbe593a02cc513d0b55527ec2df1050e2e8ff49c85c2ab',
  })
  @IsString()
  @IsNotEmpty()
  @IsHexadecimal()
  @Length(66, 66, {
    message: 'keyData must be exactly 33 bytes (66 hex characters)',
  })
  keyData: string;

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
  @Min(1, { message: 'timestamp must be a valid Unix timestamp' })
  timestamp: number;

  @ApiProperty({
    description: 'Digital signature of the data',
    example: '3045022100...',
  })
  @IsString()
  @IsNotEmpty()
  signature: string;

  @ApiProperty({
    description:
      'Whether to remove the oldest key if user has too many authentications',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  removeOld?: boolean;
}
