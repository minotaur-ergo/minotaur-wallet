import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateWalletDto, GetWalletsDto, RegisterUserDto } from './dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly authService: UserService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user with digital signature verification',
    description:
      'Register a new user with timestamp validation (2 minutes validity) and digital signature verification. If user has 5+ keys and removeOld=true, oldest key will be removed.',
  })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        chainCode: {
          type: 'string',
          example:
            '873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d5080',
        },
        keyData: {
          type: 'string',
          example:
            '0339a36013301597daef41fbe593a02cc513d0b55527ec2df1050e2e8ff49c85c2ab',
        },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        publicKeys: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              publicKey: {
                type: 'string',
                example:
                  '02a1633cafcc01ebfb6d78e39f687a1f0995c62fc95f51ead10a02ee0be551b5dc',
              },
              createdAt: {
                type: 'string',
                example: '2024-01-01T00:00:00.000Z',
              },
              updatedAt: {
                type: 'string',
                example: '2024-01-01T00:00:00.000Z',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid signature, expired timestamp, or bad request',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'Request has expired. Timestamp must be within 2 minutes.',
          enum: [
            'Invalid signature',
            'Request has expired. Timestamp must be within 2 minutes.',
            'chainCode must be exactly 32 bytes (64 hex characters)',
            'keyData must be exactly 33 bytes (66 hex characters)',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Public key already registered for this user',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: {
          type: 'string',
          example: 'Public key already registered for this user',
        },
        error: { type: 'string', example: 'Conflict' },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'User has maximum number of keys and removeOld is not set',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 422 },
        message: {
          type: 'string',
          example:
            'User has maximum number of keys. Set removeOld=true to replace oldest key.',
        },
        error: { type: 'string', example: 'Unprocessable Entity' },
      },
    },
  })
  async register(@Body() registerDto: RegisterUserDto) {
    return this.authService.registerUser(registerDto);
  }

  @Post('wallets')
  @ApiOperation({
    summary: 'Get user wallets',
    description:
      'Get all wallets associated with a user. Requires timestamp validation (2 minutes validity) and digital signature verification.',
  })
  @ApiBody({ type: GetWalletsDto })
  @ApiResponse({
    status: 200,
    description: 'User wallets retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          address: {
            type: 'string',
            example: '9f4QF8AD1nQ3nJahQVkMj8hFSVVzQBp2vjsydGpXv2MJEqnXvPH',
          },
          requiredSignatures: { type: 'number', example: 2 },
          name: { type: 'string', example: 'My MultiSig Wallet' },
          createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid signature, expired timestamp, or bad request',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'Request has expired. Timestamp must be within 2 minutes.',
          enum: [
            'Invalid signature',
            'Request has expired. Timestamp must be within 2 minutes.',
            'Invalid timestamp format',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication failed',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: {
          type: 'string',
          example: 'Public key not found in authentication records',
          enum: [
            'Public key not found in authentication records',
            'Invalid signature',
          ],
        },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  async getWallets(@Body() getWalletsDto: GetWalletsDto) {
    return this.authService.getWallets(getWalletsDto);
  }

  @Post('wallet')
  @ApiOperation({
    summary: 'Create a new wallet',
    description:
      'Create a new wallet with timestamp validation (1 minute validity) and digital signature verification. Authenticated user must be one of the wallet members.',
  })
  @ApiBody({ type: CreateWalletDto })
  @ApiResponse({
    status: 201,
    description: 'Wallet created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        address: {
          type: 'string',
          example: '9f4QF8AD1nQ3nJahQVkMj8hFSVVzQBp2vjsydGpXv2MJEqnXvPH',
        },
        requiredSignatures: { type: 'number', example: 2 },
        name: { type: 'string', example: 'My MultiSig Wallet' },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        users: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              chainCode: {
                type: 'string',
                example:
                  '873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d5080',
              },
              keyData: {
                type: 'string',
                example:
                  '0339a36013301597daef41fbe593a02cc513d0b55527ec2df1050e2e8ff49c85c2ab',
              },
              createdAt: {
                type: 'string',
                example: '2024-01-01T00:00:00.000Z',
              },
              updatedAt: {
                type: 'string',
                example: '2024-01-01T00:00:00.000Z',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid signature, expired timestamp, or bad request',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'Request has expired. Timestamp must be within 1 minute.',
          enum: [
            'Request has expired. Timestamp must be within 1 minute.',
            'Invalid timestamp format',
            'User not found with chainCode: ... and keyData: ...',
            'Authenticated user must be one of the wallet members',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication failed',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: {
          type: 'string',
          example: 'Public key not found in authentication records',
          enum: [
            'Public key not found in authentication records',
            'Invalid signature',
          ],
        },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Wallet with this address already exists',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: {
          type: 'string',
          example: 'Wallet with this address already exists',
        },
        error: { type: 'string', example: 'Conflict' },
      },
    },
  })
  async createWallet(@Body() createWalletDto: CreateWalletDto) {
    return this.authService.createWallet(createWalletDto);
  }
}
