import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';

import { AuthValidatorUtil, TimestampValidatorUtil } from '../common';
import { Auth, User, Wallet } from '../entities';
import { CreateWalletDto, GetWalletsDto, RegisterUserDto } from './dto';

// Maximum number of user records per user
const MAX_AUTH_PER_USER = 5;
const MAX_REQUEST_AGE_MINUTES = 2;
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
  ) {}

  async registerUser(registerDto: RegisterUserDto) {
    const { chainCode, keyData, publicKey, signature, timestamp, removeOld } =
      registerDto;

    // Verify timestamp validity (2 minutes)
    TimestampValidatorUtil.validateTimestamp(
      timestamp,
      MAX_REQUEST_AGE_MINUTES,
    );

    // Verify signature
    if (!this.verifySignature(registerDto, signature, publicKey)) {
      throw new BadRequestException('Invalid signature');
    }

    // Check if user exists
    let user = await this.userRepository.findOne({
      where: { chainCode, keyData },
      relations: ['publicKeys'],
    });

    // Create user if doesn't exist
    if (!user) {
      user = this.userRepository.create({
        chainCode,
        keyData,
      });
      user = await this.userRepository.save(user);
    }

    // Check if public key already exists for this user
    const existingAuth = await this.authRepository.findOne({
      where: { publicKey, userId: user.id },
    });

    if (existingAuth) {
      // If key exists, throw conflict error
      throw new ConflictException(
        'Public key already registered for this user',
      );
    }

    // Check current user count
    const authCount = await this.authRepository.count({
      where: { userId: user.id },
    });

    // If user has 5 or more keys
    if (authCount >= MAX_AUTH_PER_USER) {
      // If removeOld is not set or false, throw 422
      if (!removeOld) {
        throw new UnprocessableEntityException(
          'User has maximum number of keys. Set removeOld=true to replace oldest key.',
        );
      }

      // Remove oldest user record
      const oldestAuth = await this.authRepository.findOne({
        where: { userId: user.id },
        order: { createdAt: 'ASC' },
      });

      if (oldestAuth) {
        await this.authRepository.remove(oldestAuth);
      }
    }

    // Create new user record
    const auth = this.authRepository.create({
      publicKey,
      userId: user.id,
    });

    await this.authRepository.save(auth);

    // Return user with updated user records
    return await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['publicKeys'],
    });
  }

  private verifySignature(
    data: RegisterUserDto,
    signature: string,
    publicKey: string,
  ): boolean {
    try {
      const message = JSON.stringify({
        chainCode: data.chainCode,
        keyData: data.keyData,
        publicKey: data.publicKey,
        timestamp: data.timestamp,
      });

      const publicKeyBuffer = Buffer.from(publicKey, 'hex');
      const signatureBuffer = Buffer.from(signature, 'hex');

      const verifier = crypto.createVerify('SHA256');
      verifier.update(message);

      return verifier.verify(
        {
          key: publicKeyBuffer,
          format: 'der',
          type: 'spki',
        },
        signatureBuffer,
      );
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  }

  async getWallets(getWalletsDto: GetWalletsDto) {
    // Use AuthValidatorUtil to get user
    const user = await AuthValidatorUtil.getUser(
      getWalletsDto,
      this.authRepository,
      this.userRepository,
    );

    // Return user's wallets (already loaded via relations in getUser)
    return user.wallets;
  }

  async createWallet(createWalletDto: CreateWalletDto) {
    const { address, requiredSignatures, name, users, timestamp } =
      createWalletDto;

    // Validate timestamp (1 minute)
    TimestampValidatorUtil.validateTimestamp(timestamp, 1);

    // Get authenticated user
    const authenticatedUser = await AuthValidatorUtil.getUser(
      createWalletDto,
      this.authRepository,
      this.userRepository,
    );

    // Check if wallet address already exists
    const existingWallet = await this.walletRepository.findOne({
      where: { address },
    });

    if (existingWallet) {
      throw new ConflictException('Wallet with this address already exists');
    }

    // Get all wallet users by chainCode and keyData
    const walletUsers: User[] = [];
    for (const userInfo of users) {
      const user = await this.userRepository.findOne({
        where: {
          chainCode: userInfo.chainCode,
          keyData: userInfo.keyData,
        },
      });

      if (!user) {
        throw new BadRequestException(
          `User not found with chainCode: ${userInfo.chainCode} and keyData: ${userInfo.keyData}`,
        );
      }

      walletUsers.push(user);
    }

    // Check if authenticated user is one of the wallet users
    const isUserInWallet = walletUsers.some(
      (user) => user.id === authenticatedUser.id,
    );
    if (!isUserInWallet) {
      throw new BadRequestException(
        'Authenticated user must be one of the wallet members',
      );
    }

    // Create and save wallet
    const wallet = this.walletRepository.create({
      address,
      requiredSignatures,
      name: name || null,
      users: walletUsers,
    });

    return await this.walletRepository.save(wallet);
  }
}
