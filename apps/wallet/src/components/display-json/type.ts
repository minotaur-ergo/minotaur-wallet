import React from 'react';

type Data = string | boolean | number | Data[] | { [key: string]: Data };

type RendererPropsType = {
  data: Data;
  level: number;
};

type Renderer = React.ComponentType<RendererPropsType>;

export type { Data, RendererPropsType, Renderer };
