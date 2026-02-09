import { Expense } from '@/types/types';

const STORAGE_KEY = 'expense-tracker-data';

export const storage = {
    getExpenses: (): Expense[] => {
        if (typeof window === 'undefined') return [];
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    },

    saveExpenses: (expenses: Expense[]): void => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    exportToJSON: (expenses: Expense[]): void => {
        const dataStr = JSON.stringify(expenses, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `expenses-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    importFromJSON: (file: File): Promise<Expense[]> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const expenses = JSON.parse(e.target?.result as string);
                    if (Array.isArray(expenses)) {
                        resolve(expenses);
                    } else {
                        reject(new Error('Invalid data format'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    },
};
