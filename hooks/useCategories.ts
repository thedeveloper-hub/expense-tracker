'use client';

import { useState, useEffect } from 'react';
import { Category, DEFAULT_CATEGORIES } from '@/types/types';
import { categoryStorage } from '@/utils/categoryStorage';
import { supabaseStorage } from '@/lib/supabase/supabaseStorage';
import { useAuth } from '@/components/AuthProvider';

export const useCategories = () => {
    const { user, isConfigured } = useAuth();
    const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
    const [isLoading, setIsLoading] = useState(true);

    // Load categories from Supabase or localStorage
    useEffect(() => {
        const loadCategories = async () => {
            if (isConfigured && user) {
                // Load from Supabase
                const supabaseCategories = await supabaseStorage.getCategories(user.id);
                if (supabaseCategories.length > 0) {
                    setCategories([...DEFAULT_CATEGORIES, ...supabaseCategories.map((cat: any) => ({
                        name: cat.name,
                        icon: cat.icon,
                        color: cat.color,
                    }))]);
                }
            } else {
                // Load from localStorage
                const savedCategories = categoryStorage.getCategories();
                if (savedCategories.length > 0) {
                    setCategories(savedCategories);
                }
            }
            setIsLoading(false);
        };

        loadCategories();
    }, [user, isConfigured]);

    // Save to localStorage as backup (only when not using Supabase)
    useEffect(() => {
        if (!isLoading && !isConfigured) {
            categoryStorage.saveCategories(categories);
        }
    }, [categories, isLoading, isConfigured]);

    const addCategory = async (category: Category) => {
        // Check if category already exists
        const exists = categories.some(
            (cat) => cat.name.toLowerCase() === category.name.toLowerCase()
        );
        if (exists) {
            return false;
        }

        if (isConfigured && user) {
            // Add to Supabase
            const newCategory = await supabaseStorage.addCategory(user.id, category);
            if (newCategory) {
                setCategories((prev) => [...prev, category]);
                return true;
            }
            return false;
        } else {
            // Add to localStorage
            setCategories((prev) => [...prev, category]);
            return true;
        }
    };

    const deleteCategory = (categoryName: string) => {
        setCategories((prev) => prev.filter((cat) => cat.name !== categoryName));
    };

    const resetToDefaults = () => {
        setCategories(DEFAULT_CATEGORIES);
    };

    return {
        categories,
        isLoading,
        addCategory,
        deleteCategory,
        resetToDefaults,
    };
};
