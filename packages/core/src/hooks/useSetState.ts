/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Copied from https://github.com/streamich/react-use

import { useCallback, useState } from 'react';

import lodash from 'lodash';

export type UseSetStateOptions = {
  assign: boolean;
};

const useSetState = <T extends object>(
  initialState: T = {} as T,
): [T, (patch: Partial<T> | ((prevState: T) => Partial<T>), options?: UseSetStateOptions) => void] => {
  const [state, set] = useState<T>(initialState);
  const setState = useCallback((patch: any, options?: UseSetStateOptions) => {
    const replacer = options?.assign ? lodash.assign: lodash.merge;
    set(prevState =>
      replacer(
        {},
        prevState,
        patch instanceof Function ? patch(prevState) : patch,
      ),
    );
  }, []);

  return [state, setState];
};

export default useSetState;
