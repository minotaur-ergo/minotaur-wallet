import { useMemo } from 'react';

import JsonRenderer from '@/components/display-json/JsonRenderer';

import { Data } from './type';

interface DisplayJsonPropsType {
  data: string;
}

const DisplayJson = (props: DisplayJsonPropsType) => {
  const data: Data = useMemo(() => {
    try {
      const obj = JSON.parse(props.data);
      if (obj && typeof obj === 'object') {
        return obj as { [key: string]: Data };
      }
      if (Array.isArray(obj)) {
        return obj as Array<Data>;
      }
    } catch {
      /* empty */
    }
    return props.data;
  }, [props.data]);
  return <JsonRenderer data={data} level={0} />;
};

export default DisplayJson;
