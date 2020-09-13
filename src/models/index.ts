import { ERC20 } from './erc20';

export { ERC20 };

export class Repository {
  public erc20Map: Map<string, ERC20> = new Map();
}
