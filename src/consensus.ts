import { IView, IStateBuffer, IDispatcher, IConsensus } from './interfaces';
import { Event } from './event';
import { sha3Hash } from './util';

export class Consensus implements IConsensus {
  private readonly viewMap: Map<number, IView> = new Map();
  private latestView: IView;
  private readonly event: Event;
  private readonly sb: IStateBuffer;
  private readonly dispatcher: IDispatcher;

  constructor(event: Event, sb: IStateBuffer, dispatcher: IDispatcher) {
    this.event = event;
    this.sb = sb;
    this.dispatcher = dispatcher;
    this.latestView = {
      version: 0,
      prevHash: sha3Hash(''),
      timestamp: Date.now(),
      inputs: [],
      outputs: [],
    };

    this.viewMap.set(this.latestView.version, this.latestView);
  }

  public getLatestView(): IView {
    return this.latestView;
  }

  public getView(version: number): IView | undefined {
    return this.viewMap.get(version);
  }

  public async start() {
    while (true) {
      await sleep(3000);

      const latestView = this.latestView;
      const currentViewVersion = latestView.version + 1;
      const [inputs, outputs] = this.sb.getActiveState(latestView);

      const nextView = {
        version: currentViewVersion,
        prevHash: sha3Hash(JSON.stringify(latestView)),
        timestamp: Date.now(),
        inputs,
        outputs,
      };

      this.latestView = nextView;
      this.viewMap.set(nextView.version, nextView);

      this.event.emit('newView', nextView);
      this.dispatcher.transform(nextView.inputs);
      this.sb.flush(nextView);
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
