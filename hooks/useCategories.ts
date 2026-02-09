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
                    // User has categories, use them
                    setCategories(supabaseCategories.map((cat: any) => ({
                        id: cat.id,
                        name: cat.name,
                        icon: cat.icon,
                        color: cat.color,
                    })));
                } else {
                    // New user (no categories), seed defaults
                    const seededCategories = [];
                    for (const defaultCat of DEFAULT_CATEGORIES) {
                        const newCat = await supabaseStorage.addCategory(user.id, defaultCat);
                        if (newCat) seededCategories.push(newCat);
                    }
                    if (seededCategories.length > 0) {
                        setCategories(seededCategories);
                    }
                }
            } else {
                // Load from localStorage
                const savedCategories = categoryStorage.getCategories();
                if (savedCategories.length > 0) {
                    setCategories(savedCategories);
                } else {
                    setCategories(DEFAULT_CATEGORIES);
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
                setCategories((prev) => [...prev, newCategory]);
                return true;
            }
            return false;
        } else {
            // Add to localStorage
            const newCategory = { ...category, id: crypto.randomUUID() };
            setCategories((prev) => [...prev, newCategory]);
            return true;
        }
    };

    const deleteCategory = async (categoryIdOrName: string) => {
        if (isConfigured && user) {
            // Find category to check if it has an ID
            const categoryToDelete = categories.find(
                cat => cat.id === categoryIdOrName || cat.name === categoryIdOrName
            );

            if (categoryToDelete?.id) {
                const success = await supabaseStorage.deleteCategory(categoryToDelete.id, user.id);
                if (success) {
                    setCategories((prev) => prev.filter((cat) => cat.id !== categoryToDelete.id));
                }
            }
        } else {
            // Local storage delete (by name or id)
            setCategories((prev) => prev.filter((cat) => cat.name !== categoryIdOrName && cat.id !== categoryIdOrName));
        }
    };

    const resetToDefaults = async () => {
        if (confirm('Are you sure you want to reset all categories to default? This will delete your custom categories.')) {
            if (isConfigured && user) {
                // Delete all existing categories first
                for (const cat of categories) {
                    if (cat.id) {
                        await supabaseStorage.deleteCategory(cat.id, user.id);
                    }
                }

                // Seed defaults
                const seededCategories = [];
                for (const defaultCat of DEFAULT_CATEGORIES) {
                    const newCat = await supabaseStorage.addCategory(user.id, defaultCat);
                    if (newCat) seededCategories.push(newCat);
                }
                setCategories(seededCategories);
            } else {
                setCategories(DEFAULT_CATEGORIES);
            }
        }
    };

    return {
        categories,
        isLoading,
        addCategory,
        deleteCategory,
        resetToDefaults,
    };
};
