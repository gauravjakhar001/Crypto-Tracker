import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TableSortLabel,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CryptoAsset } from '../types/crypto';
import { formatNumber, formatPrice, formatPercentage } from '../utils/formatters';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Custom tooltip component
const CustomTooltip = ({ active, payload, coordinate }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        fontSize: '12px',
        position: 'absolute',
        left: coordinate?.x > 50 ? coordinate?.x - 100 : coordinate?.x + 20,
        top: coordinate?.y - 50,
        zIndex: 1000,
        pointerEvents: 'none',
      }}>
        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Detailed Price Data</p>
        <p style={{ margin: '0 0 3px 0' }}>Date: {data.date}</p>
        <p style={{ margin: '0 0 3px 0' }}>Price: ${formatPrice(data.price)}</p>
        {data.volume && <p style={{ margin: '0 0 3px 0' }}>Volume: ${formatNumber(data.volume)}</p>}
        {data.marketCap && <p style={{ margin: '0 0 3px 0' }}>Market Cap: ${formatNumber(data.marketCap)}</p>}
      </div>
    );
  }
  return null;
};

type SortField = keyof CryptoAsset;
type SortOrder = 'asc' | 'desc';

interface CryptoTableProps {
  assets: CryptoAsset[];
}

const CryptoTable: React.FC<CryptoTableProps> = ({ assets }) => {
  const [sortField, setSortField] = useLocalStorage<SortField>('cryptoSortField', 'price');
  const [sortOrder, setSortOrder] = useLocalStorage<SortOrder>('cryptoSortOrder', 'desc');

  const handleSort = (field: SortField) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const sortedAssets = [...assets].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === null) return 1;
    if (bValue === null) return -1;

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  return (
    <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Logo</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Symbol</TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'price'}
                direction={sortField === 'price' ? sortOrder : 'asc'}
                onClick={() => handleSort('price')}
              >
                Price
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'change1h'}
                direction={sortField === 'change1h' ? sortOrder : 'asc'}
                onClick={() => handleSort('change1h')}
              >
                1h %
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'change24h'}
                direction={sortField === 'change24h' ? sortOrder : 'asc'}
                onClick={() => handleSort('change24h')}
              >
                24h %
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'change7d'}
                direction={sortField === 'change7d' ? sortOrder : 'asc'}
                onClick={() => handleSort('change7d')}
              >
                7d %
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'marketCap'}
                direction={sortField === 'marketCap' ? sortOrder : 'asc'}
                onClick={() => handleSort('marketCap')}
              >
                Market Cap
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'volume24h'}
                direction={sortField === 'volume24h' ? sortOrder : 'asc'}
                onClick={() => handleSort('volume24h')}
              >
                24h Volume
              </TableSortLabel>
            </TableCell>
            <TableCell>Circulating Supply</TableCell>
            <TableCell>Max Supply</TableCell>
            <TableCell>7D Chart</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedAssets.map((asset, index) => (
            <TableRow key={asset.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <Box
                  component="img"
                  src={asset.logo}
                  alt={asset.symbol}
                  sx={{ width: 24, height: 24 }}
                />
              </TableCell>
              <TableCell>{asset.name}</TableCell>
              <TableCell>{asset.symbol}</TableCell>
              <TableCell>${formatPrice(asset.price)}</TableCell>
              <TableCell sx={{ color: asset.change1h >= 0 ? 'success.main' : 'error.main' }}>
                {formatPercentage(asset.change1h)}
              </TableCell>
              <TableCell sx={{ color: asset.change24h >= 0 ? 'success.main' : 'error.main' }}>
                {formatPercentage(asset.change24h)}
              </TableCell>
              <TableCell sx={{ color: asset.change7d >= 0 ? 'success.main' : 'error.main' }}>
                {formatPercentage(asset.change7d)}
              </TableCell>
              <TableCell>${formatNumber(asset.marketCap)}</TableCell>
              <TableCell>${formatNumber(asset.volume24h)}</TableCell>
              <TableCell>{formatNumber(asset.circulatingSupply)}</TableCell>
              <TableCell>{formatNumber(asset.maxSupply)}</TableCell>
              <TableCell>
                <Box sx={{ 
                  width: 100, 
                  height: 50,
                  position: 'relative',
                  '& .recharts-wrapper': {
                    position: 'absolute !important',
                    top: 0,
                    left: 0,
                  },
                  '& .recharts-surface': {
                    overflow: 'visible',
                  },
                  '& .recharts-tooltip-wrapper': {
                    zIndex: 1,
                  }
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={asset.chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" hide />
                      <YAxis hide domain={['auto', 'auto']} />
                      <Tooltip 
                        content={<CustomTooltip />}
                        cursor={{ stroke: '#ccc', strokeWidth: 1 }}
                        position={{ y: 0 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke={asset.change7d >= 0 ? '#4caf50' : '#f44336'}
                        strokeWidth={1.5}
                        dot={{ 
                          r: 2, 
                          fill: '#fff', 
                          stroke: asset.change7d >= 0 ? '#4caf50' : '#f44336',
                          strokeWidth: 1 
                        }}
                        activeDot={{ 
                          r: 4, 
                          fill: '#fff', 
                          stroke: asset.change7d >= 0 ? '#4caf50' : '#f44336',
                          strokeWidth: 2 
                        }}
                        connectNulls={true}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CryptoTable; 