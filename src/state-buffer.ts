import {
  IStateBuffer,
  IInput,
  InputLifeCycle,
  IView,
  IOutput,
  IInputGenerator,
} from './interfaces';

export class StateBuffer implements IStateBuffer {
  private inputs: IInput[] = [];
  private outputs: IOutput[] = [];
  private igMap: Map<string, IInputGenerator> = new Map();

  setIGMap(igMap: Map<string, IInputGenerator>) {
    this.igMap = igMap;
  }

  insertInputs(inputs: IInput[]): void {
    this.inputs = this.inputs.concat(inputs);
  }

  insertOutputs(outputs: IOutput[]): void {
    this.outputs = this.outputs.concat(outputs);
  }

  flush(nextView: IView): void {
    const inputs = nextView.inputs;
    const outputs = nextView.outputs;

    this.inputs = this.inputs.filter((stashInput) => {
      if (inputs.find((input) => stashInput.hash === input.hash)) {
        return false;
      }

      return true;
    });

    this.outputs = this.outputs.filter((stashOutput) => {
      if (outputs.find((output) => stashOutput.hash === output.hash)) {
        return false;
      }

      return true;
    });
  }

  getActiveState(currentView: IView): [IInput[], IOutput[]] {
    const activeInputs: IInput[] = [];
    const discardInputs: IInput[] = [];

    for (const [igType, ig] of this.igMap) {
      const inputs = this.inputs.filter((input) => input.type === igType);
      const filterWrapInputs = ig.filter(currentView, inputs);

      for (const wrapInput of filterWrapInputs) {
        switch (wrapInput.lifeCycle) {
          case InputLifeCycle.Active:
            activeInputs.push(wrapInput.input);
            break;
          case InputLifeCycle.Stash:
            break;
          case InputLifeCycle.Discard:
            discardInputs.push(wrapInput.input);
            break;
        }
      }
    }

    this.inputs.filter((stashInput) => {
      if (discardInputs.find((input) => stashInput.hash === input.hash)) {
        return false;
      }

      return true;
    });

    return [activeInputs, this.outputs];
  }
}
