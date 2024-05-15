import { DAppPropsType } from '@/types/dapps';
import { boxesToArrayBox } from '@/utils/convert';
import { useEffect, useState } from 'react';

const useAddressBoxes = (
  addresses: Array<string>,
  selectedAddress: number,
  props: DAppPropsType,
) => {
  const [boxesCount, setBoxesCount] = useState(0);
  const [oldestAge, setOldestAge] = useState(0);
  const [loading, setLoading] = useState<{ loading: boolean; address: number }>(
    { loading: false, address: -1 },
  );
  useEffect(() => {
    if (
      !loading.loading &&
      selectedAddress !== loading.address &&
      addresses.length > 0
    ) {
      setLoading({ loading: true, address: loading.address });
      const addressIndex = selectedAddress;
      props
        .getCoveringForErgAndToken(
          999999999000000000n,
          [],
          addresses[addressIndex],
        )
        .then((res) => {
          const boxes = boxesToArrayBox(res.boxes);
          setBoxesCount(boxes.length);
          const lowestHeight = Math.min(
            ...boxes.map((box) => box.creation_height()),
          );
          const network = props.chain.getNetwork();
          network.getHeight().then((height) => {
            const diff = height - lowestHeight;
            const years = diff / 365 / 720;
            setOldestAge(years);
            setLoading({ address: addressIndex, loading: false });
          });
        });
    }
  }, [props, addresses, loading, selectedAddress]);
  return {
    boxesCount,
    oldestAge,
    loading: loading.loading,
  };
};

export default useAddressBoxes;
