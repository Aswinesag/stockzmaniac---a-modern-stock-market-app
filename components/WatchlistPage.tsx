"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { WatchlistTable } from "./WatchlistTable";
import { Plus, Bell } from "lucide-react";
import AlertModal from "./AlertModal";
import { getUserAlerts } from "@/lib/actions/alert.actions";

interface WatchlistPageProps {
  initialWatchlist: StockWithData[];
}

export default function WatchlistPage({ initialWatchlist }: WatchlistPageProps) {
  const [watchlist, setWatchlist] = useState<StockWithData[]>(initialWatchlist);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockWithData | null>(null);
  const [isCreateAlertMode, setIsCreateAlertMode] = useState(false);

  const handleWatchlistChange = (symbol: string, isAdded: boolean) => {
    if (!isAdded) {
      // Remove from local state immediately for optimistic UI
      setWatchlist(prev => prev.filter(stock => stock.symbol !== symbol));
    }
  };

  const handleAddAlert = (stock: StockWithData) => {
    setSelectedStock(stock);
    setAlertModalOpen(true);
  };

  const handleAlertModalClose = () => {
    setAlertModalOpen(false);
    setSelectedStock(null);
    // Reload alerts after modal closes (in case a new alert was created)
    loadAlerts();
  };

  const handleCreateAlert = () => {
    setIsCreateAlertMode(true);
    // Could open a stock selector modal here
  };

  const loadAlerts = async () => {
    try {
      const userAlerts = await getUserAlerts();
      setAlerts(userAlerts);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    }
  };

  // Load alerts on component mount
  React.useEffect(() => {
    loadAlerts();
  }, []);

  // Listen for alert creation events
  React.useEffect(() => {
    const handleAlertCreated = () => {
      loadAlerts();
    };

    window.addEventListener('alertCreated', handleAlertCreated);
    return () => {
      window.removeEventListener('alertCreated', handleAlertCreated);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Watchlist Section - Takes 2/3 of the space */}
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Watchlist</h2>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Stock
          </Button>
        </div>
        <WatchlistTable 
          watchlist={watchlist} 
          onWatchlistChange={handleWatchlistChange}
          onAddAlert={handleAddAlert}
        />
      </div>

      {/* Alerts Section - Takes 1/3 of the space */}
      <div className="lg:col-span-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Alerts</h2>
          <Button variant="outline" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Create Alert
          </Button>
        </div>
        
        {/* Alert List */}
        <div className="space-y-4">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div key={alert.id} className="bg-card border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium">{alert.alertName}</h3>
                    <p className="text-sm text-muted-foreground">{alert.symbol} - {alert.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {alert.alertType === 'upper' ? 'Above' : 'Below'} ${alert.threshold}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {alert.frequency === 'once' ? 'Once' : alert.frequency === 'daily' ? 'Daily' : 'Weekly'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date(alert.createdAt).toLocaleDateString()}
                  </p>
                  <Button variant="outline" size="sm" className="text-xs">
                    Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No alerts set</p>
              <p className="text-sm mt-1">Create alerts to track price movements</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Alert Modal */}
      {selectedStock && (
        <AlertModal
          open={alertModalOpen}
          onOpenChange={handleAlertModalClose}
          stockData={{
            symbol: selectedStock.symbol,
            company: selectedStock.company,
            currentPrice: selectedStock.currentPrice,
          }}
        />
      )}
    </div>
  );
}
