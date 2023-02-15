import { ValueTransformer } from 'typeorm/decorator/options/ValueTransformer';

class BigIntValueTransformer implements ValueTransformer {
  from(value: string): bigint {
    return BigInt(value);
  }

  to(value: bigint): string {
    return value.toString();
  }
}

export default BigIntValueTransformer;
