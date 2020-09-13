import {
  IDispatcher,
  IOutputGenerator,
  IInput,
  IStateBuffer,
} from './interfaces';
import { genOutputWithString } from './util';

export class Dispatcher implements IDispatcher {
  private readonly ogMap: Map<string, IOutputGenerator> = new Map();
  private readonly sb: IStateBuffer;

  constructor(ogs: IOutputGenerator[], sb: IStateBuffer) {
    this.sb = sb;

    for (const og of ogs) {
      this.ogMap.set(og.type(), og);
    }
  }

  transform(inputs: IInput[]) {
    const outputs = [];

    for (const input of inputs) {
      const og = this.ogMap.get(input.type);
      if (!og) {
        const output = genOutputWithString(input, 'not found type');
        outputs.push(output);
      } else {
        const output = og.transform(input);
        outputs.push(output);
      }
    }

    this.sb.insertOutputs(outputs);
  }
}
