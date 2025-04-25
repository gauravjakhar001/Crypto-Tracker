export interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change1h: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  maxSupply: number | null;
  logo: string;
  chartData: { date: string; price: number }[];
}

export interface CryptoState {
  assets: CryptoAsset[];
  loading: boolean;
  error: string | null;
} 