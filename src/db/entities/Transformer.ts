import { ValueTransformer } from 'typeorm/decorator/options/ValueTransformer';

class BigIntValueTransformer implements ValueTransformer {
  from(value: any): any {
    return BigInt(value);
  }

  to(value: any): any {
    return value.toString();
  }
}

export default BigIntValueTransformer;
