import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { Expense, Category } from '@/types/types';

export const supabaseStorage = {
    // Check if Supabase is available
    isAvailable: isSupabaseConfigured,

    // Expenses operations
    async getExpenses(userId: string): Promise<Expense[]> {
        if (!isSupabaseConfigured()) return [];

        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching expenses:', error);
            return [];
        }

        return data || [];
    },

    async addExpense(userId: string, expense: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense | null> {
        if (!isSupabaseConfigured()) return null;

        const { data, error } = await supabase
            .from('expenses')
            .insert([
                {
                    user_id: userId,
                    amount: expense.amount,
                    category: expense.category,
                    date: expense.date,
                    description: expense.description,
                },
            ])
            .select()
            .single();

        if (error) {
            console.error('Error adding expense:', error);
            return null;
        }

        return data ? {
            id: data.id,
            amount: data.amount,
            category: data.category,
            date: data.date,
            description: data.description,
            createdAt: data.created_at,
        } : null;
    },

    async updateExpense(id: string, userId: string, updates: Partial<Expense>): Promise<boolean> {
        if (!isSupabaseConfigured()) return false;

        const { error } = await supabase
            .from('expenses')
            .update({
                amount: updates.amount,
                category: updates.category,
                date: updates.date,
                description: updates.description,
            })
            .eq('id', id)
            .eq('user_id', userId);

        if (error) {
            console.error('Error updating expense:', error);
            return false;
        }

        return true;
    },

    async deleteExpense(id: string, userId: string): Promise<boolean> {
        if (!isSupabaseConfigured()) return false;

        const { error } = await supabase
            .from('expenses')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) {
            console.error('Error deleting expense:', error);
            return false;
        }


        return true;
    },

    async clearAllExpenses(userId: string): Promise<boolean> {
        if (!isSupabaseConfigured()) return false;

        const { error } = await supabase
            .from('expenses')
            .delete()
            .eq('user_id', userId);

        if (error) {
            console.error('Error clearing all expenses:', error);
            return false;
        }

        return true;
    },

    // Categories operations
    async getCategories(userId: string) {
        if (!isSupabaseConfigured()) return [];

        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching categories:', error);
            return [];
        }

        return data || [];
    },

    async addCategory(userId: string, category: { name: string; icon: string; color: string; is_default?: boolean }) {
        if (!isSupabaseConfigured()) return null;

        const { data, error } = await supabase
            .from('categories')
            .insert([
                {
                    user_id: userId,
                    name: category.name,
                    icon: category.icon,
                    color: category.color,
                    order_index: (category as any).order_index ?? 0,
                    is_default: category.is_default ?? false,
                },
            ])
            .select()
            .single();

        if (error) {
            console.error('Error adding category:', error);
            return null;
        }

        return data;
    },

    async setDefaultCategory(userId: string, categoryId: string) {
        if (!isSupabaseConfigured()) return false;

        // First, reset all categories for this user to not default
        await supabase
            .from('categories')
            .update({ is_default: false })
            .eq('user_id', userId);

        // Then set the target category as default
        const { error } = await supabase
            .from('categories')
            .update({ is_default: true })
            .eq('id', categoryId)
            .eq('user_id', userId);

        if (error) {
            console.error('Error setting default category:', error);
            return false;
        }

        return true;
    },

    async updateCategoryOrder(userId: string, categories: Category[]) {
        if (!isSupabaseConfigured()) return false;

        const updates = categories.map((cat, index) => ({
            id: cat.id,
            user_id: userId,
            name: cat.name,
            icon: cat.icon,
            color: cat.color,
            order_index: index,
            is_default: cat.is_default ?? false,
        }));

        const { error } = await supabase
            .from('categories')
            .upsert(updates);

        if (error) {
            console.error('Error updating category order:', error);
            return false;
        }

        return true;
    },

    async deleteCategory(id: string, userId: string) {
        if (!isSupabaseConfigured()) return false;

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) {
            console.error('Error deleting category:', error);
            return false;
        }

        return true;
    },
};
