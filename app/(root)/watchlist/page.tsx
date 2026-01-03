import { Star } from 'lucide-react';
import { getWatchlistWithData } from '@/lib/actions/watchlist.actions';
import { searchStocks } from '@/lib/actions/finnhub.actions';
import SearchCommand from '@/components/SearchCommand';
import WatchlistPage from '@/components/WatchlistPage';

const Watchlist = async () => {
  // Fetch user's watchlist with detailed stock data
  const watchlist = await getWatchlistWithData();
  const initialStocks = await searchStocks();

  // Empty state
  if (watchlist.length === 0) {
    return (
    <section className="flex watchlist-empty-container">
      <div className="watchlist-empty">
        <Star className="watchlist-star" />
        <h2 className="empty-title">Your watchlist is empty</h2>
        <p className="empty-description">
          Start building your watchlist by searching for stocks and clicking the star icon to add them.
        </p>
      </div>
      <SearchCommand initialStocks={initialStocks} />
    </section>
  );
}

return (
  <section className="watchlist">
    <WatchlistPage initialWatchlist={watchlist} />
  </section>
);
};

export default Watchlist;