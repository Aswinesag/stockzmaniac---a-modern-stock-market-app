'use server';

import { getCurrentUser } from '@/lib/actions/auth.actions';
import { Watchlist } from '@/lib/database/models/watchlist.model';
import { connectToDatabase } from '@/lib/database/mongoose';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function addToWatchlist(symbol: string, company: string): Promise<{ success: boolean; error?: string }> {
    if (!symbol || !company) {
        return { success: false, error: 'Missing required fields' };
    }

    try {
        const user = await getCurrentUser();
        if (!user || !user.email) {
            redirect('/sign-in');
        }

        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) throw new Error('MongoDB connection not found');

        const dbUser = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email: user.email });

        if (!dbUser) {
            return { success: false, error: 'User not found in database' };
        }

        const userId = (dbUser.id as string) || String(dbUser._id || '');
        if (!userId) {
            return { success: false, error: 'Invalid user ID' };
        }

        // Check if stock already exists in user's watchlist
        const existingItem = await Watchlist.findOne({ 
            userId, 
            symbol: symbol.toUpperCase() 
        });
        
        if (existingItem) {
            return { success: false, error: 'Stock already in watchlist' };
        }

        await Watchlist.create({
            userId,
            symbol: symbol.toUpperCase(),
            company: company.trim(),
        });

        // Revalidate the watchlist path to update UI
        revalidatePath('/watchlist');

        return { success: true };
    } catch (err: any) {
        console.error('addToWatchlist error:', err);
        if (err.code === 11000) {
            return { success: false, error: 'Stock already in watchlist' };
        }
        return { success: false, error: 'Failed to add to watchlist' };
    }
}

export async function removeFromWatchlist(symbol: string): Promise<{ success: boolean; error?: string }> {
    if (!symbol) {
        return { success: false, error: 'Missing required fields' };
    }

    try {
        const user = await getCurrentUser();
        if (!user || !user.email) {
            redirect('/sign-in');
        }

        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) throw new Error('MongoDB connection not found');

        const dbUser = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email: user.email });

        if (!dbUser) {
            return { success: false, error: 'User not found in database' };
        }

        const userId = (dbUser.id as string) || String(dbUser._id || '');
        if (!userId) {
            return { success: false, error: 'Invalid user ID' };
        }

        const result = await Watchlist.deleteOne({ 
            userId, 
            symbol: symbol.toUpperCase() 
        });

        if (result.deletedCount === 0) {
            return { success: false, error: 'Stock not found in watchlist' };
        }

        // Revalidate the watchlist path to update UI
        revalidatePath('/watchlist');

        return { success: true };
    } catch (err) {
        console.error('removeFromWatchlist error:', err);
        return { success: false, error: 'Failed to remove from watchlist' };
    }
}

export async function getWatchlistByEmail(email: string): Promise<StockWithData[]> {
    if (!email) return [];

    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) throw new Error('MongoDB connection not found');

        const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

        if (!user) return [];

        const userId = (user.id as string) || String(user._id || '');
        if (!userId) return [];

        const items = await Watchlist.find({ userId }).sort({ addedAt: -1 }).lean();
        
        return items.map((item) => ({
            userId: item.userId,
            symbol: item.symbol,
            company: item.company,
            addedAt: item.addedAt,
        }));
    } catch (err) {
        console.error('getWatchlistByEmail error:', err);
        return [];
    }
}

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
    if (!email) return [];

    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) throw new Error('MongoDB connection not found');

        const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

        if (!user) return [];

        const userId = (user.id as string) || String(user._id || '');
        if (!userId) return [];

        const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
        return items.map((i) => String(i.symbol));
    } catch (err) {
        console.error('getWatchlistSymbolsByEmail error:', err);
        return [];
    }
}

export async function getCurrentUserWatchlist(): Promise<StockWithData[]> {
    try {
        const user = await getCurrentUser();
        if (!user || !user.email) {
            return [];
        }

        return await getWatchlistByEmail(user.email);
    } catch (err) {
        console.error('getCurrentUserWatchlist error:', err);
        return [];
    }
}

export async function getWatchlistWithData(email?: string): Promise<StockWithData[]> {
    try {
        const user = email ? { email } : await getCurrentUser();
        if (!user || !user.email) {
            return [];
        }

        // Get user's watchlist
        const watchlist = await getWatchlistByEmail(user.email);
        
        if (watchlist.length === 0) {
            return [];
        }

        // Import getStockDetails dynamically to avoid circular dependencies
        const { getStockDetails } = await import('@/lib/actions/finnhub.actions');
        
        // Fetch stock details for each watchlist item in parallel
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
        console.error('Error fetching watchlist with data:', err);
        return [];
    }
}