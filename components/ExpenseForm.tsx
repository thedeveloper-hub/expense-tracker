'use client';

import React, { useState } from 'react';
import { Category } from '@/types/types';

interface ExpenseFormProps {
    categories: Category[];
    onSubmit: (expense: {
        amount: number;
        category: string;
        date: string;
        description: string;
    }) => void;
    initialData?: {
        amount: number;
        category: string;
        date: string;
        description: string;
    };
    onCancel?: () => void;
}

export default function ExpenseForm({ categories, onSubmit, initialData, onCancel }: ExpenseFormProps) {
    const [amount, setAmount] = useState(initialData?.amount.toString() || '');
    const [category, setCategory] = useState(initialData?.category || categories[0]?.name || '');
    const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState(initialData?.description || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || parseFloat(amount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        onSubmit({
            amount: parseFloat(amount),
            category,
            date,
            description,
        });

        // Reset form if not editing
        if (!initialData) {
            setAmount('');
            setCategory(categories[0]?.name || '');
            setDate(new Date().toISOString().split('T')[0]);
            setDescription('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '700' }}>
                {initialData ? 'Edit Expense' : 'Add New Expense'}
            </h3>

            <div className="grid grid-2">
                <div className="form-group">
                    <label htmlFor="amount" className="form-label">
                        Amount (₹)
                    </label>
                    <input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        className="input"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category" className="form-label">
                        Category
                    </label>
                    <select
                        id="category"
                        className="select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        {categories.map((cat) => (
                            <option key={cat.name} value={cat.name}>
                                {cat.icon} {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="date" className="form-label">
                    Date
                </label>
                <input
                    id="date"
                    type="date"
                    className="input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="description" className="form-label">
                    Description
                </label>
                <textarea
                    id="description"
                    className="textarea"
                    placeholder="What did you spend on?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>

            <div className="flex gap-md" style={{ marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    {initialData ? '💾 Update' : '➕ Add Expense'}
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel} className="btn btn-secondary">
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
