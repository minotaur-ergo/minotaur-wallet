import { UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';

import { Auth, User } from '../../entities';

interface SignedRequest {
  signature: string;
  publicKey: string;
  timestamp: number;
  [key: string]: unknown;
}

export class AuthValidatorUtil {
  static async getUser(
    requestBody: SignedRequest,
    authRepository: Repository<Auth>,
    userRepository: Repository<User>,
  ): Promise<User> {
    const { signature, publicKey, ...dataToVerify } = requestBody;

    // Find auth record with the public key
    const auth = await authRepository.findOne({
      where: { publicKey },
      relations: ['user'],
    });

    if (!auth || !auth.user) {
      throw new UnauthorizedException(
        'Public key not found in authentication records',
      );
    }

    // Create message by sorting keys and stringifying
    const sortedData = this.sortObjectKeys(dataToVerify);
    const message = JSON.stringify(sortedData);

    // Verify signature
    if (!this.verifySignature(message, signature, publicKey)) {
      throw new UnauthorizedException('Invalid signature');
    }

    // Return the user with full relations
    return await userRepository.findOne({
      where: { id: auth.user.id },
      relations: ['publicKeys', 'wallets'],
    });
  }

  private static sortObjectKeys(
    obj: Record<string, unknown>,
  ): Record<string, unknown> {
    const sorted: Record<string, unknown> = {};
    const keys = Object.keys(obj).sort();

    for (const key of keys) {
      const value = obj[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        sorted[key] = this.sortObjectKeys(value as Record<string, unknown>);
      } else {
        sorted[key] = value;
      }
    }

    return sorted;
  }

  private static verifySignature(
    message: string,
    signature: string,
    publicKey: string,
  ): boolean {
    try {
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
}
