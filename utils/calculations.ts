import { Expense, Statistics, DateRange } from '@/types/types';

export const calculateStatistics = (expenses: Expense[]): Statistics => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const count = expenses.length;
    const average = count > 0 ? total / count : 0;

    const byCategory: Record<string, number> = {};
    const byMonth: Record<string, number> = {};

    expenses.forEach((expense) => {
        // By category
        byCategory[expense.category] = (byCategory[expense.category] || 0) + expense.amount;

        // By month
        const month = expense.date.substring(0, 7); // YYYY-MM
        byMonth[month] = (byMonth[month] || 0) + expense.amount;
    });

    return { total, average, count, byCategory, byMonth };
};

export const filterExpensesByDateRange = (
    expenses: Expense[],
    dateRange: DateRange
): Expense[] => {
    if (!dateRange.start && !dateRange.end) return expenses;

    return expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        const start = dateRange.start ? new Date(dateRange.start) : null;
        const end = dateRange.end ? new Date(dateRange.end) : null;

        if (start && expenseDate < start) return false;
        if (end && expenseDate > end) return false;
        return true;
    });
};

export const filterExpensesByCategory = (
    expenses: Expense[],
    category: string | null
): Expense[] => {
    if (!category) return expenses;
    return expenses.filter((expense) => expense.category === category);
};

export const filterExpensesBySearch = (
    expenses: Expense[],
    searchTerm: string
): Expense[] => {
    if (!searchTerm) return expenses;
    const term = searchTerm.toLowerCase();
    return expenses.filter(
        (expense) =>
            expense.description.toLowerCase().includes(term) ||
            expense.category.toLowerCase().includes(term)
    );
};

export const sortExpenses = (
    expenses: Expense[],
    sortBy: 'date' | 'amount' | 'category',
    order: 'asc' | 'desc' = 'desc'
): Expense[] => {
    const sorted = [...expenses].sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'date') {
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (sortBy === 'amount') {
            comparison = a.amount - b.amount;
        } else if (sortBy === 'category') {
            comparison = a.category.localeCompare(b.category);
        }
        return order === 'asc' ? comparison : -comparison;
    });
    return sorted;
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(amount);
};

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

// Monthly expense utilities
export const filterExpensesByMonth = (
    expenses: Expense[],
    month: string | null // Format: 'YYYY-MM' or null for all
): Expense[] => {
    if (!month) return expenses;
    return expenses.filter((expense) => expense.date.startsWith(month));
};

export const getAvailableMonths = (expenses: Expense[]): string[] => {
    const months = new Set<string>();
    expenses.forEach((expense) => {
        const month = expense.date.substring(0, 7); // YYYY-MM
        months.add(month);
    });
    return Array.from(months).sort().reverse(); // Most recent first
};

export const formatMonth = (monthString: string): string => {
    // Convert 'YYYY-MM' to 'Month YYYY'
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
    });
};

export const getCurrentMonth = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
};
