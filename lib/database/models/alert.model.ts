import { Schema, model, models, type Document, type Model, ObjectId } from 'mongoose';

export interface Alert extends Document {
  id: string;
  userId: string;
  symbol: string;
  company: string;
  alertName: string;
  alertType: 'upper' | 'lower';
  threshold: number;
  frequency: 'once' | 'daily' | 'weekly';
  isActive: boolean;
  lastTriggered?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AlertSchema = new Schema<Alert>(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    company: { type: String, required: true, trim: true },
    alertName: { type: String, required: true, trim: true },
    alertType: { type: String, required: true, enum: ['upper', 'lower'] },
    threshold: { type: Number, required: true },
    frequency: { type: String, required: true, enum: ['once', 'daily', 'weekly'], default: 'once' },
    isActive: { type: Boolean, required: true, default: true },
    lastTriggered: { type: Date },
  },
  { timestamps: true }
);

// Indexes for efficient queries
AlertSchema.index({ userId: 1, symbol: 1 });
AlertSchema.index({ userId: 1, isActive: 1 });
AlertSchema.index({ lastTriggered: 1 });

export const AlertModel: Model<Alert> =
  (models?.Alert as Model<Alert>) || model<Alert>('Alert', AlertSchema);
