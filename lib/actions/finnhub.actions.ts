'use server';

import { POPULAR_STOCK_SYMBOLS } from '@/lib/constants';
import { formatArticle, getDateRange, validateArticle } from '@/lib/utils';
import { cache } from 'react';
import { getCurrentUser } from '@/lib/actions/auth.actions';
import { getCurrentUserWatchlist } from '@/lib/actions/watchlist.actions';

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const NEXT_PUBLIC_FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY ?? '';

async function fetchJSON<T>(url: string, revalidateSeconds?: number): Promise<T> {
  const options: RequestInit & { next?: { revalidate?: number } } = revalidateSeconds
    ? { cache: 'force-cache', next: { revalidate: revalidateSeconds } }
    : { cache: 'no-store' };

  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Fetch failed ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

export { fetchJSON };

export async function getNews(symbols?: string[]): Promise<MarketNewsArticle[]> {
  try {
    const range = getDateRange(5);
    const token = process.env.FINNHUB_API_KEY ?? NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!token) {
      throw new Error('FINNHUB API key is not configured');
    }
    const cleanSymbols = (symbols || [])
      .map((s) => s?.trim().toUpperCase())
      .filter((s): s is string => Boolean(s));

    const maxArticles = 6;

    // If we have symbols, try to fetch company news per symbol and round-robin select
    if (cleanSymbols.length > 0) {
      const perSymbolArticles: Record<string, RawNewsArticle[]> = {};

      await Promise.all(
        cleanSymbols.map(async (sym) => {
          try {
            const url = `${FINNHUB_BASE_URL}/company-news?symbol=${encodeURIComponent(sym)}&from=${range.from}&to=${range.to}&token=${token}`;
            const articles = await fetchJSON<RawNewsArticle[]>(url, 300);
            perSymbolArticles[sym] = (articles || []).filter(validateArticle);
          } catch (e) {
            console.error('Error fetching company news for', sym, e);
            perSymbolArticles[sym] = [];
          }
        })
      );

      const collected: MarketNewsArticle[] = [];
      // Round-robin up to 6 picks
      for (let round = 0; round < maxArticles; round++) {
        for (let i = 0; i < cleanSymbols.length; i++) {
          const sym = cleanSymbols[i];
          const list = perSymbolArticles[sym] || [];
          if (list.length === 0) continue;
          const article = list.shift();
          if (!article || !validateArticle(article)) continue;
          collected.push(formatArticle(article, true, sym, round));
          if (collected.length >= maxArticles) break;
        }
        if (collected.length >= maxArticles) break;
      }

      if (collected.length > 0) {
        // Sort by datetime desc
        collected.sort((a, b) => (b.datetime || 0) - (a.datetime || 0));
        return collected.slice(0, maxArticles);
      }
      // If none collected, fall through to general news
    }

    // General market news fallback or when no symbols provided
    const generalUrl = `${FINNHUB_BASE_URL}/news?category=general&token=${token}`;
    const general = await fetchJSON<RawNewsArticle[]>(generalUrl, 300);

    const seen = new Set<string>();
    const unique: RawNewsArticle[] = [];
    for (const art of general || []) {
      if (!validateArticle(art)) continue;
      const key = `${art.id}-${art.url}-${art.headline}`;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(art);
      if (unique.length >= 20) break; // cap early before final slicing
    }

    const formatted = unique.slice(0, maxArticles).map((a, idx) => formatArticle(a, false, undefined, idx));
    return formatted;
  } catch (err) {
    console.error('getNews error:', err);
    throw new Error('Failed to fetch news');
  }
}

export const getStockDetails = cache(async (symbol: string): Promise<{
  symbol: string;
  name: string;
  currentPrice?: number;
  changePercent?: number;
  priceFormatted?: string;
  changeFormatted?: string;
  marketCap?: string;
  peRatio?: string;
} | null> => {
  try {
    const token = process.env.FINNHUB_API_KEY ?? NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!token) {
      console.error('FINNHUB API key is not configured');
      return null;
    }

    const upperSymbol = symbol.toUpperCase();
    
    // Fetch quote, profile, and financials in parallel
    const [quoteData, profileData, financialsData] = await Promise.all([
      fetchJSON<QuoteData>(`${FINNHUB_BASE_URL}/quote?symbol=${upperSymbol}&token=${token}`, 60),
      fetchJSON<ProfileData>(`${FINNHUB_BASE_URL}/stock/profile2?symbol=${upperSymbol}&token=${token}`, 3600),
      fetchJSON<FinancialsData>(`${FINNHUB_BASE_URL}/stock/metric?symbol=${upperSymbol}&metric=all&token=${token}`, 3600)
    ]);

    const currentPrice = quoteData?.c;
    const changePercent = quoteData?.dp;
    const name = profileData?.name || upperSymbol;
    const marketCap = profileData?.marketCapitalization;
    const peRatio = financialsData?.metric?.peBasicExclExtraTTM;

    // Format price and change for display
    let priceFormatted = '';
    let changeFormatted = '';
    
    if (typeof currentPrice === 'number') {
      priceFormatted = currentPrice.toFixed(2);
    }
    
    if (typeof changePercent === 'number') {
      const sign = changePercent >= 0 ? '+' : '';
      changeFormatted = `${sign}${changePercent.toFixed(2)}%`;
    }

    // Format market cap
    let marketCapFormatted = '';
    if (typeof marketCap === 'number') {
      if (marketCap >= 1e12) {
        marketCapFormatted = `$${(marketCap / 1e12).toFixed(2)}T`;
      } else if (marketCap >= 1e9) {
        marketCapFormatted = `$${(marketCap / 1e9).toFixed(2)}B`;
      } else if (marketCap >= 1e6) {
        marketCapFormatted = `$${(marketCap / 1e6).toFixed(2)}M`;
      } else {
        marketCapFormatted = `$${marketCap.toFixed(0)}`;
      }
    }

    // Format P/E ratio
    let peRatioFormatted = '';
    if (typeof peRatio === 'number' && isFinite(peRatio)) {
      peRatioFormatted = peRatio.toFixed(2);
    } else {
      peRatioFormatted = 'N/A';
    }

    return {
      symbol: upperSymbol,
      name,
      currentPrice,
      changePercent,
      priceFormatted,
      changeFormatted,
      marketCap: marketCapFormatted,
      peRatio: peRatioFormatted,
    };
  } catch (err) {
    console.error('Error fetching stock details:', err);
    return null;
  }
});

export const getUserWatchlist = cache(async (): Promise<StockWithData[]> => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.email) {
      return [];
    }

    // Get user's watchlist with stock details
    const watchlist = await getCurrentUserWatchlist();
    
    // Fetch stock details for each watchlist item
    const watchlistWithDetails = await Promise.all(
      watchlist.map(async (item) => {
        try {
          const details = await getStockDetails(item.symbol);
          return {
            ...item,
            currentPrice: details?.currentPrice,
            changePercent: details?.changePercent,
            priceFormatted: details?.priceFormatted,
            changeFormatted: details?.changeFormatted,
            marketCap: details?.marketCap,
            peRatio: details?.peRatio,
          };
        } catch (error) {
          console.error(`Error fetching details for ${item.symbol}:`, error);
          return item;
        }
      })
    );

    return watchlistWithDetails;
  } catch (err) {
    console.error('Error fetching user watchlist:', err);
    return [];
  }
});

export const searchStocks = cache(async (query?: string): Promise<StockWithWatchlistStatus[]> => {
  try {
    const token = process.env.FINNHUB_API_KEY ?? NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!token) {
      // If no token, log and return empty to avoid throwing per requirements
      console.error('Error in stock search:', new Error('FINNHUB API key is not configured'));
      return [];
    }

    const trimmed = typeof query === 'string' ? query.trim() : '';

    let results: FinnhubSearchResult[] = [];

    if (!trimmed) {
      // Fetch top 10 popular symbols' profiles
      const top = POPULAR_STOCK_SYMBOLS.slice(0, 10);
      const profiles = await Promise.all(
        top.map(async (sym) => {
          try {
            const url = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${encodeURIComponent(sym)}&token=${token}`;
            // Revalidate every hour
            const profile = await fetchJSON<any>(url, 3600);
            return { sym, profile } as { sym: string; profile: any };
          } catch (e) {
            console.error('Error fetching profile2 for', sym, e);
            return { sym, profile: null } as { sym: string; profile: any };
          }
        })
      );

      results = profiles
        .map(({ sym, profile }) => {
          const symbol = sym.toUpperCase();
          const name: string | undefined = profile?.name || profile?.ticker || undefined;
          const exchange: string | undefined = profile?.exchange || undefined;
          if (!name) return undefined;
          const r: FinnhubSearchResult = {
            symbol,
            description: name,
            displaySymbol: symbol,
            type: 'Common Stock',
          };
          // We don't include exchange in FinnhubSearchResult type, so carry via mapping later using profile
          // To keep pipeline simple, attach exchange via closure map stage
          // We'll reconstruct exchange when mapping to final type
          (r as any).__exchange = exchange; // internal only
          return r;
        })
        .filter((x): x is FinnhubSearchResult => Boolean(x));
    } else {
      const url = `${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(trimmed)}&token=${token}`;
      const data = await fetchJSON<FinnhubSearchResponse>(url, 1800);
      results = Array.isArray(data?.result) ? data.result : [];
    }

    // Get user's watchlist symbols to include watchlist status
    let watchlistSymbols: string[] = [];
    try {
      const user = await getCurrentUser();
      if (user && user.email) {
        const watchlist = await getCurrentUserWatchlist();
        watchlistSymbols = watchlist.map(item => item.symbol);
      }
    } catch (error) {
      // If user is not authenticated or there's an error, continue with empty watchlist
      console.log('Could not get watchlist symbols for search:', error);
    }

    const mapped: StockWithWatchlistStatus[] = results
      .map((r) => {
        const upper = (r.symbol || '').toUpperCase();
        const name = r.description || upper;
        const exchangeFromDisplay = (r.displaySymbol as string | undefined) || undefined;
        const exchangeFromProfile = (r as any).__exchange as string | undefined;
        const exchange = exchangeFromDisplay || exchangeFromProfile || 'US';
        const type = r.type || 'Stock';
        const item: StockWithWatchlistStatus = {
          symbol: upper,
          name,
          exchange,
          type,
          isInWatchlist: watchlistSymbols.includes(upper),
        };
        return item;
      })
      .slice(0, 15);

    return mapped;
  } catch (err) {
    console.error('Error in stock search:', err);
    return [];
  }
});