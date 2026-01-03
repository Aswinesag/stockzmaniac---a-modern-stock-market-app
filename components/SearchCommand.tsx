'use client';

import { Button } from '@/components/ui/button';
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from '@/components/ui/command';
import { useDebounce } from '@/hooks/useDebounce';
import { searchStocks } from '@/lib/actions/finnhub.actions';
import { getCurrentUserWatchlistSymbols } from '@/lib/actions/watchlist.actions';
import { Loader2, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import WatchlistButton from './WatchlistButton';

export default function SearchCommand({renderAs = 'button', label = "Add stock", initialStocks, className = ""} : SearchCommandProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks);

    const isSearchMode = searchTerm.trim();
    const displayStocks = isSearchMode ? stocks : stocks?.slice(0,10);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
        }, []);

        const handleSearch = async () => {
            if(!searchTerm) return setStocks(initialStocks);
            setLoading(true);
            try {
                const results = await searchStocks(searchTerm.trim());
                setStocks(results);
            } catch {
                setStocks([]);
            } finally {
                setLoading(false);
            }
        }

        const debounceSearch = useDebounce(handleSearch, 300);

        useEffect(() => {
            debounceSearch();
        }, [searchTerm]);

        const handleSelectStock = () => {
            setOpen(false);
            setSearchTerm("");
            setStocks(initialStocks);
        };

        const handleWatchlistChange = (symbol: string, isAdded: boolean) => {
            // Update the stocks array to reflect the watchlist change immediately
            setStocks(prev => prev.map(stock => 
                stock.symbol === symbol 
                    ? { ...stock, isInWatchlist: isAdded }
                    : stock
            ));
        };

        return (
            <>
            {renderAs==="text" ? (
                <span onClick={() => setOpen(true)} className='search-text'>
                    {label}
                </span>
            ) : (
                <Button onClick={() => setOpen(true)} className={`search-btn ${className}`}>
                    {label}
                </Button>
            )}
            <CommandDialog open={open} onOpenChange={setOpen} className='search-dialog'>
                <div className='search-field'>
                    <CommandInput placeholder="Search stocks..." value={searchTerm} onValueChange={setSearchTerm} className='search-input'/>
                    {loading && <Loader2 className='search-loader'/>}
                </div>
                <CommandList className='search-list'>
                    {loading ? (
                        <CommandEmpty className='search-list-empty'>Loading...</CommandEmpty>
                    ) : displayStocks?.length===0 ? (
                        <div className='search-list-indicator'>
                            {isSearchMode ? "No stocks found" : "No stocks available"}
                        </div>
                    ) : (
                        <ul>
                            <div className='search-count'>
                                {isSearchMode ? "Search results" : "Popular stocks"}
                                {``}({displayStocks?.length || 0})
                            </div>
                            {displayStocks?.map((stock, i) => (
                                <li key={stock.symbol} className='search-item'>
                                    <Link 
                                        href={`/stocks/${stock.symbol}`} 
                                        onClick={handleSelectStock}
                                        className='search-item-link'
                                        >
                                            <TrendingUp className='h-4 w-4 text-gray-500' />
                                            <div className='flex-1'>
                                                <div className='search-item-name'>
                                                    {stock.name}
                                                </div>
                                                <div className='text-sm text-gray-500'>
                                                    {stock.symbol} | {stock.exchange} | {stock.type}
                                                </div>
                                            </div>
                                            <WatchlistButton
                                                symbol={stock.symbol}
                                                company={stock.name}
                                                isInWatchlist={stock.isInWatchlist}
                                                type="icon"
                                                onWatchlistChange={handleWatchlistChange}
                                            />
                                        </Link>
                                </li>
                            ))}
                        </ul>
                    )
                    }
                </CommandList>
            </CommandDialog>
            </>
        );
    }
