'use server';

import { getCurrentUser } from '@/lib/actions/auth.actions';
import { AlertModel } from '@/lib/database/models/alert.model';
import { connectToDatabase } from '@/lib/database/mongoose';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getStockDetails } from '@/lib/actions/finnhub.actions';
import { inngest } from '@/lib/inngest/client';
import { ObjectId } from 'mongodb';

export async function createAlert(data: {
  symbol: string;
  company: string;
  alertName: string;
  alertType: 'upper' | 'lower';
  threshold: number;
  frequency: 'once' | 'daily' | 'weekly';
}): Promise<{ success: boolean; error?: string }> {
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

    // Create the alert
    const alert = await AlertModel.create({
      userId,
      symbol: data.symbol.toUpperCase(),
      company: data.company.trim(),
      alertName: data.alertName.trim(),
      alertType: data.alertType,
      threshold: data.threshold,
      frequency: data.frequency,
    });

    // Send confirmation email (optional - don't fail if this fails)
    try {
      await inngest.send({
        name: 'app/alert.created',
        data: {
          email: user.email,
          alertName: data.alertName,
          symbol: data.symbol,
          company: data.company,
          alertType: data.alertType,
          threshold: data.threshold,
          frequency: data.frequency,
        },
      });
    } catch (emailError) {
      console.warn('Failed to send confirmation email:', emailError);
      // Don't fail the whole operation if email fails
    }

    // Revalidate the watchlist path to update UI
    revalidatePath('/watchlist');

    return { success: true };
  } catch (err: any) {
    console.error('createAlert error:', err);
    return { success: false, error: 'Failed to create alert' };
  }
}

export async function getUserAlerts(): Promise<any[]> {
  try {
    const user = await getCurrentUser();
    if (!user || !user.email) {
      return [];
    }

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    const dbUser = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email: user.email });

    if (!dbUser) {
      return [];
    }

    const userId = (dbUser.id as string) || String(dbUser._id || '');
    if (!userId) {
      return [];
    }

    const alerts = await AlertModel.find({ userId, isActive: true }).sort({ createdAt: -1 }).lean();
    
    return alerts.map((alert) => ({
      ...alert,
      _id: alert._id?.toString(),
      id: alert._id?.toString(),
    }));
  } catch (err) {
    console.error('getUserAlerts error:', err);
    return [];
  }
}

export async function deleteAlert(alertId: string): Promise<{ success: boolean; error?: string }> {
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

    const result = await AlertModel.deleteOne({ _id: alertId, userId });

    if (result.deletedCount === 0) {
      return { success: false, error: 'Alert not found' };
    }

    // Revalidate the watchlist path to update UI
    revalidatePath('/watchlist');

    return { success: true };
  } catch (err) {
    console.error('deleteAlert error:', err);
    return { success: false, error: 'Failed to delete alert' };
  }
}

export async function checkAndTriggerAlerts(): Promise<void> {
  try {
    // Get all active alerts that need to be checked
    const alerts = await AlertModel.find({ isActive: true }).lean();

    for (const alert of alerts) {
      try {
        // Get current stock price
        const stockDetails = await getStockDetails(alert.symbol);
        if (!stockDetails || !stockDetails.currentPrice) {
          continue;
        }

        const currentPrice = stockDetails.currentPrice;
        let shouldTrigger = false;

        // Check if alert condition is met
        if (alert.alertType === 'upper' && currentPrice >= alert.threshold) {
          shouldTrigger = true;
        } else if (alert.alertType === 'lower' && currentPrice <= alert.threshold) {
          shouldTrigger = true;
        }

        // Check frequency constraints
        if (shouldTrigger) {
          const now = new Date();
          const lastTriggered = alert.lastTriggered;

          let canTrigger = false;

          if (!lastTriggered) {
            canTrigger = true;
          } else {
            const timeDiff = now.getTime() - lastTriggered.getTime();
            const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

            switch (alert.frequency) {
              case 'once':
                // Never trigger again for 'once' frequency
                canTrigger = false;
                break;
              case 'daily':
                canTrigger = daysDiff >= 1;
                break;
              case 'weekly':
                canTrigger = daysDiff >= 7;
                break;
            }
          }

          if (canTrigger) {
            // Get user email
            const mongoose = await connectToDatabase();
            const db = mongoose.connection.db;
            if (!db) continue;

            const dbUser = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ 
      id: alert.userId
    });
            
            if (dbUser?.email) {
              // Send alert email
              await inngest.send({
                name: 'app/alert.triggered',
                data: {
                  email: dbUser.email,
                  alertName: alert.alertName,
                  symbol: alert.symbol,
                  company: alert.company,
                  currentPrice,
                  threshold: alert.threshold,
                  alertType: alert.alertType,
                },
              });

              // Update last triggered timestamp
              await AlertModel.updateOne(
                { _id: alert._id },
                { lastTriggered: now }
              );

              // If it's a 'once' alert, deactivate it
              if (alert.frequency === 'once') {
                await AlertModel.updateOne(
                  { _id: alert._id },
                  { isActive: false }
                );
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error checking alert ${alert._id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in checkAndTriggerAlerts:', error);
  }
}
