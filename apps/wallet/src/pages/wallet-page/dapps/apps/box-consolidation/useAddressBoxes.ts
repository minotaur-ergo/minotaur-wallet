import { DAppPropsType } from '@minotaur-ergo/types';
import { boxesToArrayBox } from '@/utils/convert';
import { useEffect, useState } from 'react';

const useAddressBoxes = (
  addresses: Array<string>,
  selectedAddress: number,
  props: DAppPropsType,
) => {
  const [boxesCount, setBoxesCount] = useState(0);
  const [oldestAge, setOldestAge] = useState(0);
  const [height, setHeight] = useState(0);
  const [loadState, setLoadState] = useState<{
    loading: boolean;
    address: number;
  }>({ loading: false, address: -1 });
  useEffect(() => {
    if (
      !loadState.loading &&
      selectedAddress !== loadState.address &&
      addresses.length > 0
    ) {
      setLoadState({ loading: true, address: loadState.address });
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
            setHeight(height);
            const diff = height - lowestHeight;
            const years = diff / 365 / 720;
            setOldestAge(years);
            setLoadState({ address: addressIndex, loading: false });
          });
        });
    }
  }, [props, addresses, loadState, selectedAddress]);
  return {
    boxesCount,
    oldestAge,
    loading: loadState.loading,
    height,
  };
};

export default useAddressBoxes;
