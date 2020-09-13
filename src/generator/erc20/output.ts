import { IOutputGenerator, IInput, IOutput } from '../../interfaces';
import { genOutputWithString } from '../../util';
import { Repository, ERC20 } from '../../models';
import { IERC20TransferData, IERC20CreateData, IERC20Data } from './types';

export class ERC20OutputGenerator implements IOutputGenerator {
  private readonly repo: Repository;

  constructor(repo: Repository) {
    this.repo = repo;
  }

  transform(input: IInput): IOutput {
    const data: IERC20Data = JSON.parse(input.data);

    switch (data.method) {
      case 'create':
        return this.create(input);
      case 'transfer':
        return this.transfer(input);
    }

    return genOutputWithString(input, 'not found method');
  }

  transfer(input: IInput): IOutput {
    const transformInput: IERC20TransferData = JSON.parse(input.data);

    const erc20 = this.repo.erc20Map.get(transformInput.erc20ID);
    if (!erc20) {
      return genOutputWithString(input, `${transformInput.erc20ID} not found`);
    }

    erc20.transfer({
      from: transformInput.from,
      to: transformInput.to,
      balance: transformInput.balance,
    });

    return genOutputWithString(input, 'success');
  }

  create(input: IInput): IOutput {
    const createInput: IERC20CreateData = JSON.parse(input.data);
    const balances = new Map();
    balances.set(createInput.creator, createInput.creatorBalance);

    const erc20 = new ERC20(
      createInput.erc20ID,
      createInput.creator,
      createInput.supply,
      balances,
    );

    this.repo.erc20Map.set(erc20.getERC20ID(), erc20);

    return genOutputWithString(input, 'success');
  }

  type(): string {
    return 'ERC20';
  }
}
