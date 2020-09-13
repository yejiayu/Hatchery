import {
  IInputGenerator,
  IInput,
  IView,
  InputLifeCycle,
  WrapInput,
  IStateBuffer,
} from '../../interfaces';
import { Event } from '../../event';

export class ERC20InputGenerator implements IInputGenerator {
  private event: Event;
  private sb: IStateBuffer;

  constructor(sb: IStateBuffer, event: Event) {
    this.event = event;
    this.sb = sb;

    this.event.on('newView', (_) => console.log('[coin-input] new view'));
  }

  allow(input: IInput): void {
    if (this.sb) {
      this.sb.insertInputs([input]);
    }
  }

  filter(_: IView, inputs: IInput[]): WrapInput[] {
    const wrapInputs: WrapInput[] = inputs.map((input) => {
      return { lifeCycle: InputLifeCycle.Active, input };
    });
    return wrapInputs;
  }

  type() {
    return 'ERC20';
  }
}
