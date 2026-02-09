'use client';

import React, { useState } from 'react';
import { Category } from '@/types/types';

interface CategoryManagerProps {
    categories: Category[];
    onAddCategory: (category: Category) => Promise<boolean>;
    onDeleteCategory: (categoryName: string) => void;
    onResetCategories: () => void;
    onReorderCategories: (categories: Category[]) => void;
    onSetDefaultCategory: (categoryId: string) => void;
}

const EMOJI_OPTIONS = ['🍔', '🚗', '🛍️', '🎬', '📄', '⚕️', '📚', '📦', '🏠', '💡', '🎮', '✈️', '🎵', '💪', '🐕', '☕', '🎨', '🔧'];
const COLOR_OPTIONS = [
    '#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF8B94',
    '#C7CEEA', '#B4A7D6', '#95E1D3', '#FF9A8B', '#6C5CE7',
    '#FD79A8', '#FDCB6E', '#00B894', '#0984E3', '#E17055',
];

export default function CategoryManager({
    categories,
    onAddCategory,
    onDeleteCategory,
    onResetCategories,
    onReorderCategories,
    onSetDefaultCategory,
}: CategoryManagerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState(EMOJI_OPTIONS[0]);
    const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newCategoryName.trim()) {
            alert('Please enter a category name');
            return;
        }

        const success = await onAddCategory({
            name: newCategoryName.trim(),
            icon: selectedIcon,
            color: selectedColor,
        });

        if (success) {
            setNewCategoryName('');
            setSelectedIcon(EMOJI_OPTIONS[0]);
            setSelectedColor(COLOR_OPTIONS[0]);
            alert('✅ Category added successfully!');
        } else {
            alert('❌ Category already exists!');
        }
    };

    const handleDelete = (categoryName: string) => {
        if (confirm(`Are you sure you want to delete the "${categoryName}" category?`)) {
            onDeleteCategory(categoryName);
        }
    };

    const handleReset = () => {
        if (confirm('⚠️ Reset to default categories? This will remove all custom categories.')) {
            onResetCategories();
        }
    };

    // Drag and Drop Handlers
    const onDragStart = (e: React.DragEvent, index: number) => {
        setDraggedItemIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        // e.dataTransfer.setData('text/html', e.currentTarget as any); // generic fallback
    };

    const onDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault(); // Necessary to allow dropping
        e.dataTransfer.dropEffect = 'move';

        if (draggedItemIndex === null || draggedItemIndex === index) return;

        const newCategories = [...categories];
        const draggedItem = newCategories[draggedItemIndex];

        // Remove dragged item
        newCategories.splice(draggedItemIndex, 1);
        // Insert at new position
        newCategories.splice(index, 0, draggedItem);

        onReorderCategories(newCategories);
        setDraggedItemIndex(index);
    };

    const onDragEnd = () => {
        setDraggedItemIndex(null);
    };

    return (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div className="flex-between mb-lg">
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                    🏷️ Manage Categories
                </h3>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="btn btn-secondary btn-sm"
                >
                    {isOpen ? '▲ Hide' : '▼ Show'}
                </button>
            </div>

            {isOpen && (
                <div>
                    {/* Add New Category Form */}
                    <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
                        <div className="grid grid-2" style={{ marginBottom: '1rem' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label htmlFor="categoryName" className="form-label">
                                    Category Name
                                </label>
                                <input
                                    id="categoryName"
                                    type="text"
                                    className="input"
                                    placeholder="e.g., Groceries"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label htmlFor="categoryIcon" className="form-label">
                                    Icon
                                </label>
                                <select
                                    id="categoryIcon"
                                    className="select"
                                    value={selectedIcon}
                                    onChange={(e) => setSelectedIcon(e.target.value)}
                                >
                                    {EMOJI_OPTIONS.map((emoji) => (
                                        <option key={emoji} value={emoji}>
                                            {emoji}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label className="form-label">Color</label>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {COLOR_OPTIONS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setSelectedColor(color)}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: 'var(--radius-md)',
                                            backgroundColor: color,
                                            border: selectedColor === color ? '3px solid white' : '1px solid var(--border)',
                                            cursor: 'pointer',
                                            transition: 'transform var(--transition-fast)',
                                            transform: selectedColor === color ? 'scale(1.1)' : 'scale(1)',
                                        }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            ➕ Add Category
                        </button>
                    </form>

                    {/* Category List */}
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                        <div className="flex-between mb-md">
                            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                All Categories ({categories.length})
                            </h4>
                            <button onClick={handleReset} className="btn btn-secondary btn-sm">
                                🔄 Reset to Defaults
                            </button>
                        </div>

                        <div className="grid grid-3" style={{ gap: '0.75rem' }}>
                            {categories.map((category, index) => (
                                <div
                                    key={category.name}
                                    draggable
                                    onDragStart={(e) => onDragStart(e, index)}
                                    onDragOver={(e) => onDragOver(e, index)}
                                    onDragEnd={onDragEnd}
                                    className="glass-card"
                                    style={{
                                        padding: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '0.5rem',
                                        cursor: 'grab',
                                        opacity: draggedItemIndex === index ? 0.5 : 1,
                                        transform: draggedItemIndex === index ? 'scale(1.05)' : 'scale(1)',
                                        transition: 'transform 0.1s ease, box-shadow 0.1s ease',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                                        <span style={{ fontSize: '1.5rem' }}>{category.icon}</span>
                                        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{category.name}</span>
                                        <div
                                            style={{
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '50%',
                                                backgroundColor: category.color,
                                            }}
                                        />
                                        {category.is_default && <span title="Default Category">⭐</span>}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                        {!category.is_default && (
                                            <button
                                                onClick={() => onSetDefaultCategory(category.id || category.name)}
                                                className="btn btn-sm"
                                                style={{
                                                    padding: '0.25rem 0.5rem',
                                                    fontSize: '0.75rem',
                                                    background: 'transparent',
                                                    border: '1px solid var(--border)',
                                                    color: 'var(--text-secondary)',
                                                }}
                                                title="Set as Default"
                                            >
                                                ☆
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onDeleteCategory(category.id || category.name)}
                                            className="btn btn-danger"
                                            style={{
                                                padding: '0.25rem 0.5rem',
                                                fontSize: '0.75rem',
                                                opacity: 0.7,
                                            }}
                                            title="Delete Category"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '1rem' }}>
                            💡 Drag and drop categories to reorder them
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
