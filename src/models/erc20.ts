export class ERC20 {
  private readonly erc20ID: string;
  private readonly creator: string;
  private readonly supply: number;
  private readonly balances: Map<string, number>;

  constructor(
    erc20ID: string,
    creator: string,
    supply: number,
    balances: Map<string, number>,
  ) {
    this.erc20ID = erc20ID;
    this.balances = balances;
    this.supply = supply;
    this.creator = creator;
  }

  getERC20ID(): string {
    return this.erc20ID;
  }

  getBalance(address: string): number {
    const balance = this.balances.get(address);
    if (balance) {
      return balance;
    }

    return 0;
  }

  getCreator(): string {
    return this.creator;
  }

  getSupply(): number {
    return this.supply;
  }

  transfer({
    from,
    to,
    balance,
  }: {
    from: string;
    to: string;
    balance: number;
  }): void {
    const fromBalance = this.balances.get(from);
    if (!fromBalance || fromBalance < balance) {
      throw new Error(`${from} is insufficient balance`);
    }

    let toBalance = this.balances.get(to);
    if (!toBalance) {
      toBalance = 0;
    }

    this.balances.set(from, fromBalance - balance);
    this.balances.set(to, toBalance + balance);
  }
}
