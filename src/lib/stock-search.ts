export type StockSearch = {
  make: string;
  model: string;
  maxPrice: number;
  minYear: number;
  maxMileage: number;
  transmission: string;
  fuel: string;
  body: string;
  colour: string;
  drive: string;
  sort: string;
  page: number;
};

export const DEFAULT_STOCK_SEARCH: StockSearch = {
  make: "",
  model: "",
  maxPrice: 0,
  minYear: 0,
  maxMileage: 0,
  transmission: "",
  fuel: "",
  body: "",
  colour: "",
  drive: "",
  sort: "newest",
  page: 1,
};

/** Build a complete /stock search object from partial filters. */
export const stockSearch = (overrides: Partial<StockSearch> = {}): StockSearch => ({
  ...DEFAULT_STOCK_SEARCH,
  ...overrides,
});
