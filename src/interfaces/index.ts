export interface IInput {
  readonly type: string;
  readonly data: string;
  readonly hash: string;
}

export interface IOutput {
  readonly type: string;
  readonly inputHash: string;
  readonly data: string;
  readonly hash: string;
}

export interface IView {
  readonly version: number;
  readonly prevHash: string;
  readonly timestamp: number;
  readonly inputs: IInput[];
  readonly outputs: IInput[];
}

export interface IConsensus {
  getLatestView(): IView;
  getView(version: number): IView | undefined;
}

export enum InputLifeCycle {
  Stash = 0,
  Active = 1,
  Discard = 2,
}

export interface WrapInput {
  lifeCycle: InputLifeCycle;
  input: IInput;
}

export interface IInputGenerator {
  allow(input: IInput): void;
  filter(currentView: IView, inputs: IInput[]): WrapInput[];
  type(): string;
}

export interface IOutputGenerator {
  transform(input: IInput): IOutput;
  type(): string;
}

export interface IDispatcher {
  transform(inputs: IInput[]): void;
}

export interface IStateBuffer {
  insertInputs(inputs: IInput[]): void;
  insertOutputs(outputs: IOutput[]): void;
  flush(nextView: IView): void;

  getActiveState(currentView: IView): [IInput[], IOutput[]];
}
