import React, { useEffect, useState } from 'react';
// import { erg_nano_erg_to_str } from "../utils/utils";
import Asset from '../../db/entities/Asset';
import TokenName from './TokenName';
import { AssetDbAction } from '../../action/db';

type PropsType = {
  erg: bigint;
  class?: string;
  showUnit?: boolean;
  token?: string;
  network_type: string;
};

const ERG_FACTOR = BigInt(1e9);

const erg_nano_erg_to_str = (
  erg: bigint,
  nano_erg: bigint,
  digits?: number,
  maxDigit?: number
) => {
  maxDigit = maxDigit !== undefined ? maxDigit : 9;
  if (!digits) digits = 3;
  if (digits > maxDigit) digits = maxDigit;
  let nano_erg_str = '' + nano_erg;
  while (nano_erg_str.length < maxDigit) nano_erg_str = '0' + nano_erg_str;
  while (
    nano_erg_str.length > digits &&
    nano_erg_str.substring(nano_erg_str.length - 1) === '0'
  )
    nano_erg_str = nano_erg_str.substring(0, nano_erg_str.length - 1);
  return nano_erg_str.length === 0 ? erg.toString() : `${erg}.${nano_erg_str}`;
};

const Erg = (props: PropsType) => {
  const [token, setToken] = useState<Asset | undefined | null>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (props.token) {
      if (!(token && token.asset_id === props.token)) {
        if (!loading) {
          setLoading(true);
          AssetDbAction.getAssetByAssetId(props.token, props.network_type).then(
            (token) => {
              setToken(token);
              setLoading(true);
            }
          );
        }
      }
    }
  }, [props.network_type, props.token, token, loading]);
  const maxDecimal = props.token
    ? token && token.decimal
      ? token.decimal
      : 0
    : 9;
  const factor = props.token ? BigInt(Math.pow(10, maxDecimal)) : ERG_FACTOR;
  const erg = props.erg / factor;
  const nano_erg = props.erg - erg * factor;
  const erg_str = erg_nano_erg_to_str(erg, nano_erg, 2, maxDecimal);
  const unit = props.showUnit ? (
    props.token ? (
      <TokenName token_id={props.token} network_type={props.network_type} />
    ) : (
      ' ERG'
    )
  ) : (
    ''
  );
  return (
    <span className={props.class}>
      {erg_str} {unit}
    </span>
  );
};

export default Erg;
