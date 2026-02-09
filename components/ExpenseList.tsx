'use client';

import React, { useState, useMemo } from 'react';
import { Expense, Category } from '@/types/types';
import { formatCurrency, formatDate, sortExpenses } from '@/utils/calculations';

interface ExpenseListProps {
    categories: Category[];
    expenses: Expense[];
    onEdit: (expense: Expense) => void;
    onDelete: (id: string) => void;
}

export default function ExpenseList({ categories, expenses, onEdit, onDelete }: ExpenseListProps) {
    const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [filterCategory, setFilterCategory] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAndSortedExpenses = useMemo(() => {
        let filtered = expenses;

        // Filter by category
        if (filterCategory) {
            filtered = filtered.filter((exp) => exp.category === filterCategory);
        }

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (exp) =>
                    exp.description.toLowerCase().includes(term) ||
                    exp.category.toLowerCase().includes(term)
            );
        }

        // Sort
        return sortExpenses(filtered, sortBy, sortOrder);
    }, [expenses, filterCategory, searchTerm, sortBy, sortOrder]);

    const toggleSort = (field: 'date' | 'amount' | 'category') => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    const getCategoryColor = (categoryName: string) => {
        const category = categories.find((cat) => cat.name === categoryName);
        return category?.color || '#95E1D3';
    };

    const getCategoryIcon = (categoryName: string) => {
        const category = categories.find((cat) => cat.name === categoryName);
        return category?.icon || '📦';
    };

    const [showAllHistory, setShowAllHistory] = useState(false);
    const INITIAL_HISTORY_COUNT = 10;

    const displayedExpenses = showAllHistory
        ? filteredAndSortedExpenses
        : filteredAndSortedExpenses.slice(0, INITIAL_HISTORY_COUNT);

    return (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div className="flex-between mb-lg">
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Expense History</h3>
                <div className="flex gap-md">
                    <input
                        type="text"
                        className="input"
                        placeholder="🔍 Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '200px' }}
                    />
                    <select
                        className="select"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        style={{ width: '150px' }}
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.name} value={cat.name}>
                                {cat.icon} {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredAndSortedExpenses.length === 0 ? (
                <div className="text-center" style={{ padding: '3rem', color: 'var(--text-tertiary)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                    <p>No expenses found. Start tracking your spending!</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th onClick={() => toggleSort('date')} style={{ cursor: 'pointer' }}>
                                    Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th>Category</th>
                                <th>Description</th>
                                <th onClick={() => toggleSort('amount')} style={{ cursor: 'pointer' }}>
                                    Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedExpenses.map((expense) => (
                                <tr key={expense.id} className="fade-in">
                                    <td style={{ color: 'var(--text-secondary)' }}>
                                        {formatDate(expense.date)}
                                    </td>
                                    <td>
                                        <span
                                            className="badge"
                                            style={{
                                                backgroundColor: `${getCategoryColor(expense.category)}20`,
                                                color: getCategoryColor(expense.category),
                                                border: `1px solid ${getCategoryColor(expense.category)}40`,
                                            }}
                                        >
                                            <span>{getCategoryIcon(expense.category)}</span>
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td>{expense.description}</td>
                                    <td style={{ fontWeight: '700', fontSize: '1.05rem' }}>
                                        {formatCurrency(expense.amount)}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div className="flex gap-sm" style={{ justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => onEdit(expense)}
                                                className="btn btn-secondary btn-sm"
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this expense?')) {
                                                        onDelete(expense.id);
                                                    }
                                                }}
                                                className="btn btn-danger btn-sm"
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Show More / Less Button */}
            {filteredAndSortedExpenses.length > INITIAL_HISTORY_COUNT && (
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <button
                        onClick={() => setShowAllHistory(!showAllHistory)}
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%' }}
                    >
                        {showAllHistory ? 'Show Less 🔼' : `Show All (${filteredAndSortedExpenses.length}) 🔽`}
                    </button>
                </div>
            )}

            <div className="text-center mt-md" style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                Showing {displayedExpenses.length} of {expenses.length} expenses
            </div>
        </div>
    );
}
