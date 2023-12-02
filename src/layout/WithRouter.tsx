import React from 'react';
import { Params, useParams } from 'react-router-dom';

interface WithRouterPropsType {
  params: Params<string>;
}

export function withRouter<T extends WithRouterPropsType = WithRouterPropsType>(
  WrappedComponent: React.ComponentType<T>
) {
  // Try to create a nice displayName for React Dev Tools.
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  // Creating the inner component. The calculated Props type here is the where the magic happens.
  const ComponentWithTheme = (props: Omit<T, keyof WithRouterPropsType>) => {
    // Fetch the props you want to inject. This could be done with context instead.
    const cp = useParams();
    const params = {
      params: cp,
      ...props,
    };

    // props comes afterwards so the can override the default ones.
    return <WrappedComponent {...(params as T)} />;
  };

  ComponentWithTheme.displayName = `withRouter(${displayName})`;

  return ComponentWithTheme;
}

export default withRouter;

export type { WithRouterPropsType };
