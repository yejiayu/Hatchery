import { SHA3 } from 'sha3';
import { IOutput, IInput } from './interfaces';

const hash = new SHA3(256);

export function sha3Hash(input: string): string {
  return hash.update(input).digest('hex');
}

export function genOutputWithString(input: IInput, str: string): IOutput {
  const output = {
    type: input.type,
    inputHash: input.hash,
    data: str,
    hash: '',
  };

  output.hash = sha3Hash(JSON.stringify(output));
  return output;
}

export function genInputWithData(type: string, data: string): IInput {
  const input = {
    type,
    data,
    hash: '',
  };

  input.hash = sha3Hash(JSON.stringify(input));
  return input;
}
