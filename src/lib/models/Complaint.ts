import mongoose, { Schema, Document } from 'mongoose';
import { Complaint as ComplaintType } from '@/types';

export interface ComplaintDocument extends Omit<ComplaintType, '_id'>, Document {}

const ComplaintSchema = new Schema<ComplaintDocument>({
  title: {
    type: String,
    required: [true, 'Please provide a complaint title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a complaint description'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Product', 'Service', 'Support', 'Technical', 'Other'],
  },
  priority: {
    type: String,
    required: [true, 'Please provide a priority level'],
    enum: ['Low', 'Medium', 'High'],
  },
  status: {
    type: String,
    required: [true, 'Please provide a status'],
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending',
  },
  dateSubmitted: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Complaint || mongoose.model<ComplaintDocument>('Complaint', ComplaintSchema);
