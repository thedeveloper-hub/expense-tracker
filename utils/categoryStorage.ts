import { Category } from '@/types/types';

const CATEGORIES_STORAGE_KEY = 'expense-tracker-categories';

export const categoryStorage = {
    getCategories: (): Category[] => {
        if (typeof window === 'undefined') return [];
        try {
            const data = localStorage.getItem(CATEGORIES_STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading categories from localStorage:', error);
            return [];
        }
    },

    saveCategories: (categories: Category[]): void => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
        } catch (error) {
            console.error('Error saving categories to localStorage:', error);
        }
    },
};
