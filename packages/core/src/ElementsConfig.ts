import type { ElementsConfig as ElementsConfigObj } from '@react-native-ajp-elements/common';
import lodash from 'lodash';
import { init as initLog } from './logger';

class ElementsConfig<ElementsConfigObj> {
  variables;

  public constructor() {
    this.variables = <ElementsConfigObj>{};
  }

  /**
   * Gets a specific configuration item.
   * @param name the name of the configuration items
   * @returns the value of the configuration item
   */
  public get<T>(name: keyof ElementsConfigObj) {
    return <T>(<unknown>this.variables[name]);
  }

  /**
   * Initialize with a configuration.
   * @param config - configuration key/value pairs
   */
  public init(config: ElementsConfigObj) {
    lodash.assign(this.variables, config);
    // @ts-ignore
    initLog(config.userId);
  }

  /**
   * Set a configuration item.
   * @param config - configuration key/value pairs
   */
  public set(config: ElementsConfigObj) {
    lodash.merge(this.variables, config);
  }
}

const config = new ElementsConfig<ElementsConfigObj>();
export { config };
