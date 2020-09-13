import { IStateBuffer, IInputGenerator, IOutputGenerator } from '../interfaces';
import { ERC20InputGenerator } from './erc20/input';
import { Event } from '../event';
import { Repository } from '../models';
import { ERC20OutputGenerator } from './erc20/output';

export function getInputGenerators(
  sb: IStateBuffer,
  event: Event,
): IInputGenerator[] {
  const erc20IG = new ERC20InputGenerator(sb, event);

  return [erc20IG];
}

export function getOutputGenerators(repo: Repository): IOutputGenerator[] {
  const erc20OG = new ERC20OutputGenerator(repo);

  return [erc20OG];
}
