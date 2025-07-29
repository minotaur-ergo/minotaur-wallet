import { BadRequestException } from '@nestjs/common';

export class TimestampValidatorUtil {
  static validateTimestamp(timestamp: number, maxAgeMinutes: number): void {
    if (typeof timestamp !== 'number' || timestamp <= 0) {
      throw new BadRequestException('Invalid timestamp format');
    }

    const currentTime = Date.now();
    const timeDifference = Math.abs(currentTime - timestamp);
    const maxAgeMs = maxAgeMinutes * 60 * 1000;

    if (timeDifference > maxAgeMs) {
      throw new BadRequestException(
        `Request has expired. Timestamp must be within ${maxAgeMinutes} minute(s).`,
      );
    }
  }

  static isTimestampValid(timestamp: number, maxAgeMinutes: number): boolean {
    if (typeof timestamp !== 'number' || timestamp <= 0) {
      return false;
    }

    const currentTime = Date.now();
    const timeDifference = Math.abs(currentTime - timestamp);
    const maxAgeMs = maxAgeMinutes * 60 * 1000;

    return timeDifference <= maxAgeMs;
  }
}
