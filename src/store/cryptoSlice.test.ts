import cryptoReducer, { setAssets, updateAsset, setLoading, setError } from './cryptoSlice';
import { CryptoAsset } from '../types/crypto';

describe('cryptoSlice', () => {
  const initialState = {
    assets: [],
    loading: false,
    error: null,
  };

  const mockAsset: CryptoAsset = {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 50000,
    change1h: 0.5,
    change24h: 2.5,
    change7d: 5.0,
    marketCap: 950000000000,
    volume24h: 25000000000,
    circulatingSupply: 19000000,
    maxSupply: 21000000,
    logo: 'https://example.com/bitcoin.png',
    chartData: [],
  };

  it('should handle initial state', () => {
    expect(cryptoReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setAssets', () => {
    const assets = [mockAsset];
    const actual = cryptoReducer(initialState, setAssets(assets));
    expect(actual.assets).toEqual(assets);
  });

  it('should handle updateAsset', () => {
    const updatedAsset = { ...mockAsset, price: 51000 };
    const state = { ...initialState, assets: [mockAsset] };
    const actual = cryptoReducer(state, updateAsset(updatedAsset));
    expect(actual.assets[0].price).toEqual(51000);
  });

  it('should handle setLoading', () => {
    const actual = cryptoReducer(initialState, setLoading(true));
    expect(actual.loading).toEqual(true);
  });

  it('should handle setError', () => {
    const error = 'Network error';
    const actual = cryptoReducer(initialState, setError(error));
    expect(actual.error).toEqual(error);
  });
}); 