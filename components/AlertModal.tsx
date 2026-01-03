"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { toast } from "sonner";

interface AlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stockData: {
    symbol: string;
    company: string;
    currentPrice?: number;
  };
}

export default function AlertModal({ open, onOpenChange, stockData }: AlertModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    alertName: `${stockData.company} Price Alert`,
    alertType: "upper" as "upper" | "lower",
    threshold: stockData.currentPrice ? (stockData.currentPrice * 1.1).toFixed(2) : "",
    frequency: "once" as "once" | "daily" | "weekly",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.threshold || !formData.alertName) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const { createAlert } = await import("@/lib/actions/alert.actions");
      const result = await createAlert({
        symbol: stockData.symbol,
        company: stockData.company,
        alertName: formData.alertName,
        alertType: formData.alertType,
        threshold: parseFloat(formData.threshold),
        frequency: formData.frequency,
      });

      if (result.success) {
        toast.success("Alert created successfully!");
        onOpenChange(false);
        // Reset form
        setFormData({
          alertName: `${stockData.company} Price Alert`,
          alertType: "upper",
          threshold: stockData.currentPrice ? (stockData.currentPrice * 1.1).toFixed(2) : "",
          frequency: "once",
        });
        
        // Trigger parent component to refresh alerts
        const event = new CustomEvent('alertCreated', { detail: { symbol: stockData.symbol } });
        window.dispatchEvent(event);
      } else {
        toast.error(result.error || "Failed to create alert");
      }
    } catch (error) {
      console.error('Alert creation error:', error);
      toast.error(`Failed to create alert: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Price Alert</DialogTitle>
          <DialogDescription>
            Set up an alert for {stockData.company} ({stockData.symbol})
            {stockData.currentPrice && (
              <span className="block text-sm mt-1">
                Current price: ${stockData.currentPrice.toFixed(2)}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="alertName">Alert Name</Label>
            <Input
              id="alertName"
              value={formData.alertName}
              onChange={(e) => setFormData(prev => ({ ...prev, alertName: e.target.value }))}
              placeholder="Enter alert name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alertType">Alert Type</Label>
            <Select
              value={formData.alertType}
              onValueChange={(value: "upper" | "lower") => 
                setFormData(prev => ({ ...prev, alertType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select alert type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upper">
                  Price goes above
                </SelectItem>
                <SelectItem value="lower">
                  Price goes below
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="threshold">Threshold Price ($)</Label>
            <Input
              id="threshold"
              type="number"
              step="0.01"
              min="0"
              value={formData.threshold}
              onChange={(e) => setFormData(prev => ({ ...prev, threshold: e.target.value }))}
              placeholder="Enter threshold price"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select
              value={formData.frequency}
              onValueChange={(value: "once" | "daily" | "weekly") => 
                setFormData(prev => ({ ...prev, frequency: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once">
                  Once (then deactivate)
                </SelectItem>
                <SelectItem value="daily">
                  Daily
                </SelectItem>
                <SelectItem value="weekly">
                  Weekly
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Alert"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
