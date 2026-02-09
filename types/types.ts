export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string; // ISO date string
  description: string;
  createdAt: string;
}

export interface Category {
  id?: string;
  name: string;
  color: string;
  icon: string;
  order_index?: number;
  is_default?: boolean;
}

export interface Statistics {
  total: number;
  average: number;
  count: number;
  byCategory: Record<string, number>;
  byMonth: Record<string, number>;
}

export interface DateRange {
  start: string | null;
  end: string | null;
}

export interface Filters {
  category: string | null;
  dateRange: DateRange;
  searchTerm: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { name: 'Food', color: '#FF6B6B', icon: '🍔' },
  { name: 'Transport', color: '#4ECDC4', icon: '🚗' },
  { name: 'Shopping', color: '#FFE66D', icon: '🛍️' },
  { name: 'Entertainment', color: '#A8E6CF', icon: '🎬' },
  { name: 'Bills', color: '#FF8B94', icon: '📄' },
  { name: 'Health', color: '#C7CEEA', icon: '⚕️' },
  { name: 'Education', color: '#B4A7D6', icon: '📚' },
  { name: 'Other', color: '#95E1D3', icon: '📦' },
];
