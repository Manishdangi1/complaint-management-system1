export interface Complaint {
  _id?: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  dateSubmitted: Date;
  userId?: string;
}

export type ComplaintCategory = 'Product' | 'Service' | 'Support' | 'Technical' | 'Other';
export type ComplaintPriority = 'Low' | 'Medium' | 'High';
export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved';

export interface User {
  _id?: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  name: string;
  createdAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ComplaintFilters {
  status?: ComplaintStatus;
  priority?: ComplaintPriority;
  category?: ComplaintCategory;
}
