import type { ReactElement } from 'react';

export interface ConditionalWrapperInterface {
  condition: boolean;
  wrapper: (children: ReactElement) => ReactElement;
  children: ReactElement;
}

// See https://blog.hackages.io/conditionally-wrap-an-element-in-react-a8b9a47fab2
const ConditionalWrapper: React.FC<ConditionalWrapperInterface> = ({
  condition,
  wrapper,
  children,
}: ConditionalWrapperInterface): ReactElement => {
  return condition ? wrapper(children) : children;
};

export { ConditionalWrapper };
