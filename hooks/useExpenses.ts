'use client';

import { useState, useEffect } from 'react';
import { Expense } from '@/types/types';
import { storage } from '@/utils/storage';
import { supabaseStorage } from '@/lib/supabase/supabaseStorage';
import { useAuth } from '@/components/AuthProvider';
import { useStorageMode } from '@/components/StorageModeProvider';

export const useExpenses = () => {
    const { user } = useAuth();
    const { storageMode } = useStorageMode();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load expenses based on storage mode
    useEffect(() => {
        const loadExpenses = async () => {
            if (storageMode === 'supabase' && user) {
                // Load from Supabase
                const supabaseExpenses = await supabaseStorage.getExpenses(user.id);
                setExpenses(supabaseExpenses);
            } else {
                // Load from localStorage
                const localExpenses = storage.getExpenses();
                setExpenses(localExpenses);
            }
            setIsLoading(false);
        };

        loadExpenses();
    }, [user, storageMode]);

    // Save to localStorage as backup (only when in local mode)
    useEffect(() => {
        if (!isLoading && storageMode === 'local') {
            storage.saveExpenses(expenses);
        }
    }, [expenses, isLoading, storageMode]);

    const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
        if (storageMode === 'supabase' && user) {
            // Add to Supabase
            const newExpense = await supabaseStorage.addExpense(user.id, expense);
            if (newExpense) {
                setExpenses((prev) => [newExpense, ...prev]);
            }
        } else {
            // Add to localStorage
            const newExpense: Expense = {
                ...expense,
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
            };
            setExpenses((prev) => [newExpense, ...prev]);
        }
    };

    const updateExpense = async (id: string, updates: Partial<Expense>) => {
        if (storageMode === 'supabase' && user) {
            // Update in Supabase
            const success = await supabaseStorage.updateExpense(id, user.id, updates);
            if (success) {
                setExpenses((prev) =>
                    prev.map((expense) =>
                        expense.id === id ? { ...expense, ...updates } : expense
                    )
                );
            }
        } else {
            // Update in localStorage
            setExpenses((prev) =>
                prev.map((expense) =>
                    expense.id === id ? { ...expense, ...updates } : expense
                )
            );
        }
    };

    const deleteExpense = async (id: string) => {
        if (storageMode === 'supabase' && user) {
            // Delete from Supabase
            const success = await supabaseStorage.deleteExpense(id, user.id);
            if (success) {
                setExpenses((prev) => prev.filter((expense) => expense.id !== id));
            }
        } else {
            // Delete from localStorage
            setExpenses((prev) => prev.filter((expense) => expense.id !== id));
        }
    };

    const clearAllExpenses = async () => {
        if (storageMode === 'supabase' && user) {
            const success = await supabaseStorage.clearAllExpenses(user.id);
            if (success) {
                setExpenses([]);
            }
        } else {
            setExpenses([]);
        }
    };

    const exportExpenses = () => {
        storage.exportToJSON(expenses);
    };

    const importExpenses = async (file: File) => {
        try {
            const importedExpenses = await storage.importFromJSON(file);
            setExpenses(importedExpenses);
            return true;
        } catch (error) {
            console.error('Error importing expenses:', error);
            return false;
        }
    };

    // Sync local data to cloud
    const syncLocalToCloud = async () => {
        if (storageMode !== 'supabase' || !user) {
            console.warn('Cannot sync to cloud: Supabase mode not active or user not logged in');
            return { success: false, message: 'Please switch to Cloud mode and log in first' };
        }

        try {
            const localExpenses = storage.getExpenses();
            if (localExpenses.length === 0) {
                return { success: false, message: 'No local data to sync' };
            }

            // Upload each expense to Supabase
            let successCount = 0;
            for (const expense of localExpenses) {
                const { id, createdAt, ...expenseData } = expense;
                const newExpense = await supabaseStorage.addExpense(user.id, expenseData);
                if (newExpense) successCount++;
            }

            // Reload from Supabase
            const supabaseExpenses = await supabaseStorage.getExpenses(user.id);
            setExpenses(supabaseExpenses);

            return {
                success: true,
                message: `Successfully synced ${successCount} of ${localExpenses.length} expenses to cloud`
            };
        } catch (error) {
            console.error('Error syncing to cloud:', error);
            return { success: false, message: 'Failed to sync to cloud' };
        }
    };

    // Sync cloud data to local
    const syncCloudToLocal = async () => {
        if (storageMode !== 'local') {
            console.warn('Cannot sync to local: Local mode not active');
            return { success: false, message: 'Please switch to Local mode first' };
        }

        if (!user) {
            return { success: false, message: 'Please log in to access cloud data' };
        }

        try {
            // Fetch from Supabase
            const cloudExpenses = await supabaseStorage.getExpenses(user.id);
            if (cloudExpenses.length === 0) {
                return { success: false, message: 'No cloud data to sync' };
            }

            // Save to localStorage and update state
            storage.saveExpenses(cloudExpenses);
            setExpenses(cloudExpenses);

            return {
                success: true,
                message: `Successfully synced ${cloudExpenses.length} expenses from cloud to local`
            };
        } catch (error) {
            console.error('Error syncing from cloud:', error);
            return { success: false, message: 'Failed to sync from cloud' };
        }
    };

    return {
        expenses,
        isLoading,
        addExpense,
        updateExpense,
        deleteExpense,
        clearAllExpenses,
        exportExpenses,
        importExpenses,
        syncLocalToCloud,
        syncCloudToLocal,
    };
};
