import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import CryptoTable from './components/CryptoTable';
import { useAppDispatch, useAppSelector } from './hooks/useRedux';
import { setAssets, updateAsset } from './store/cryptoSlice';
import WebSocketService from './services/websocketService';
import { Container, Typography, Box } from '@mui/material';

const initialAssets = [
  {
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
    logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
    chartData: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: 50000 * (1 + (Math.random() - 0.5) * 0.1),
    })),
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 3000,
    change1h: -0.3,
    change24h: 1.8,
    change7d: 3.5,
    marketCap: 350000000000,
    volume24h: 15000000000,
    circulatingSupply: 120000000,
    maxSupply: null,
    logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    chartData: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: 3000 * (1 + (Math.random() - 0.5) * 0.1),
    })),
  },
  {
    id: 'tether',
    name: 'Tether',
    symbol: 'USDT',
    price: 1.0,
    change1h: 0.0,
    change24h: 0.0,
    change7d: 0.0,
    marketCap: 80000000000,
    volume24h: 50000000000,
    circulatingSupply: 80000000000,
    maxSupply: null,
    logo: 'https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663',
    chartData: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: 1.0,
    })),
  },
  {
    id: 'binance-coin',
    name: 'Binance Coin',
    symbol: 'BNB',
    price: 400,
    change1h: 0.8,
    change24h: 3.2,
    change7d: 7.5,
    marketCap: 60000000000,
    volume24h: 2000000000,
    circulatingSupply: 150000000,
    maxSupply: 200000000,
    logo: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850',
    chartData: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: 400 * (1 + (Math.random() - 0.5) * 0.1),
    })),
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    price: 100,
    change1h: -1.2,
    change24h: 4.5,
    change7d: 12.0,
    marketCap: 40000000000,
    volume24h: 3000000000,
    circulatingSupply: 400000000,
    maxSupply: null,
    logo: 'https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422',
    chartData: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: 100 * (1 + (Math.random() - 0.5) * 0.1),
    })),
  },
];

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const assets = useAppSelector((state) => state.crypto.assets);

  useEffect(() => {
    dispatch(setAssets(initialAssets));
    const wsService = WebSocketService.getInstance();

    const handleUpdate = (updatedAssets: typeof initialAssets) => {
      updatedAssets.forEach((asset) => {
        dispatch(updateAsset(asset));
      });
    };

    wsService.subscribe(handleUpdate);
    wsService.start(initialAssets);

    return () => {
      wsService.unsubscribe(handleUpdate);
      wsService.stop();
    };
  }, [dispatch]);

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Crypto Price Tracker
        </Typography>
        <CryptoTable assets={assets} />
      </Box>
    </Container>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App; 