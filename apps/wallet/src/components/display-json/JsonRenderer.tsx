import React from 'react';

import BooleanElement from '@/components/display-json/BooleanElement';
import JsonElement from '@/components/display-json/JsonElement';
import StringElement from '@/components/display-json/StringElement';

import { Data, RendererPropsType } from './type';

const JsonRenderer = (props: RendererPropsType) => {
  return (
    <React.Fragment>
      {typeof props.data === 'object' && (
        <JsonElement
          data={props.data as { [key: string]: Data }}
          renderer={JsonRenderer}
          level={props.level}
        />
      )}
      {(typeof props.data === 'string' || typeof props.data === 'number') && (
        <StringElement data={props.data} component={'span'} />
      )}
      {typeof props.data === 'boolean' && (
        <BooleanElement data={props.data} component={'span'} />
      )}
    </React.Fragment>
  );
};
export default JsonRenderer;
