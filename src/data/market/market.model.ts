export type MarketResponse = {
  markets: Market[];
  pageSize: number;
  pageIndex: number;
  count: number;
};
export type Market = {
  id?: string;
  name: string;
  description?: string;
};
