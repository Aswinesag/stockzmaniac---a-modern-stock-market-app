'use client';

import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from './ui/button';
import { WATCHLIST_TABLE_HEADER } from '@/lib/constants';
import WatchlistButton from './WatchlistButton';
import { useRouter } from 'next/navigation';
import { cn, getChangeColorClass } from '@/lib/utils';

interface WatchlistTableProps {
  watchlist: StockWithData[];
  onWatchlistChange?: (symbol: string, isAdded: boolean) => void;
  onAddAlert?: (stock: StockWithData) => void;
}

export function WatchlistTable({ watchlist, onWatchlistChange, onAddAlert }: WatchlistTableProps) {
  const router = useRouter();
  const [removingSymbol, setRemovingSymbol] = useState<string | null>(null);

  const handleRemoveClick = async (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    setRemovingSymbol(symbol);
    try {
      const { removeFromWatchlist } = await import('@/lib/actions/watchlist.actions');
      const result = await removeFromWatchlist(symbol);
      if (result.success) {
        onWatchlistChange?.(symbol, false);
      }
    } catch (error) {
      console.error('Failed to remove from watchlist:', error);
    } finally {
      setRemovingSymbol(null);
    }
  };

  return (
    <>
      <Table className='scrollbar-hide-default watchlist-table'>
        <TableHeader>
          <TableRow className='table-header-row'>
            <TableHead className='table-header'>Company</TableHead>
            <TableHead className='table-header'>Symbol</TableHead>
            <TableHead className='table-header text-right'>Price</TableHead>
            <TableHead className='table-header text-right'>Change</TableHead>
            <TableHead className='table-header text-right'>Market Cap</TableHead>
            <TableHead className='table-header text-right'>P/E Ratio</TableHead>
            <TableHead className='table-header text-right'>Alert</TableHead>
            <TableHead className='table-header text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {watchlist.map((stock) => {
            const isPositive = stock.changePercent && stock.changePercent >= 0;
            const ChangeIcon = isPositive ? TrendingUp : TrendingDown;
            
            return (
              <TableRow key={stock.symbol} className="hover:bg-muted/50">
                <TableCell className="font-medium text-white">
                  <Link 
                    href={`/stocks/${stock.symbol}`}
                    className="hover:text-primary transition-colors text-white"
                  >
                    {stock.company}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link 
                    href={`/stocks/${stock.symbol}`}
                    className="font-mono text-sm hover:text-primary transition-colors text-white"
                  >
                    {stock.symbol}
                  </Link>
                </TableCell>
                <TableCell className="text-right font-mono text-white">
                  {stock.priceFormatted || 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <ChangeIcon className={`w-4 h-4 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
                    <span className={`font-mono text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.changeFormatted || 'N/A'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono text-white">
                  {stock.marketCap || 'N/A'}
                </TableCell>
                <TableCell className="text-right font-mono text-white">
                  {stock.peRatio || 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => onAddAlert?.(stock)}
                  >
                    Add Alert
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <WatchlistButton
                      symbol={stock.symbol}
                      company={stock.company}
                      isInWatchlist={true}
                      type="icon"
                      onWatchlistChange={onWatchlistChange}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleRemoveClick(stock.symbol, e)}
                      disabled={removingSymbol === stock.symbol}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}