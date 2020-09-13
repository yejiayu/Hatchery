export interface IERC20Data {
  readonly method: string;
}

export interface IERC20TransferData extends IERC20Data {
  readonly erc20ID: string;
  readonly from: string;
  readonly to: string;
  readonly balance: number;
}

export interface IERC20CreateData extends IERC20Data {
  readonly erc20ID: string;
  readonly creator: string;
  readonly supply: number;
  readonly creatorBalance: number;
}
