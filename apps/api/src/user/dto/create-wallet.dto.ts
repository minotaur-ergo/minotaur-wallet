import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class WalletUserDto {
  @ApiProperty({
    description: 'Chain code for the user (32 bytes hex)',
    example:
      '873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d5080',
  })
  @IsString()
  @IsNotEmpty()
  chainCode: string;

  @ApiProperty({
    description: 'Key data for the user (33 bytes hex)',
    example:
      '0339a36013301597daef41fbe593a02cc513d0b55527ec2df1050e2e8ff49c85c2ab',
  })
  @IsString()
  @IsNotEmpty()
  keyData: string;
}

export class CreateWalletDto {
  @ApiProperty({
    description: 'Wallet address',
    example: '9f4QF8AD1nQ3nJahQVkMj8hFSVVzQBp2vjsydGpXv2MJEqnXvPH',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Number of required signatures',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  requiredSignatures: number;

  @ApiProperty({
    description: 'Optional wallet name',
    example: 'My MultiSig Wallet',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Array of users who are members of this wallet',
    type: [WalletUserDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => WalletUserDto)
  users: WalletUserDto[];

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
