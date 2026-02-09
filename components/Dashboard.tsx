'use client';

import React from 'react';
import { Expense, Category } from '@/types/types';
import { calculateStatistics, formatCurrency } from '@/utils/calculations';

interface DashboardProps {
    categories: Category[];
    expenses: Expense[];
}

export default function Dashboard({ categories, expenses }: DashboardProps) {
    const stats = calculateStatistics(expenses);

    const getCategoryColor = (categoryName: string) => {
        const category = categories.find((cat) => cat.name === categoryName);
        return category?.color || '#95E1D3';
    };

    const getCategoryIcon = (categoryName: string) => {
        const category = categories.find((cat) => cat.name === categoryName);
        return category?.icon || '📦';
    };

    const categoryData = Object.entries(stats.byCategory)
        .map(([category, amount]) => ({
            category,
            amount,
            percentage: stats.total > 0 ? (amount / stats.total) * 100 : 0,
        }))
        .sort((a, b) => b.amount - a.amount);

    return (
        <div>
            {/* Statistics Cards */}
            <div className="grid grid-3 mb-xl">
                <div className="glass-card stat-card fade-in">
                    <div className="stat-label">Total Spent</div>
                    <div className="stat-value">{formatCurrency(stats.total)}</div>
                    <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                        All time
                    </div>
                </div>

                <div className="glass-card stat-card fade-in" style={{ animationDelay: '100ms' }}>
                    <div className="stat-label">Average Expense</div>
                    <div className="stat-value">{formatCurrency(stats.average)}</div>
                    <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                        Per transaction
                    </div>
                </div>

                <div className="glass-card stat-card fade-in" style={{ animationDelay: '200ms' }}>
                    <div className="stat-label">Total Expenses</div>
                    <div className="stat-value">{stats.count}</div>
                    <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                        Transactions
                    </div>
                </div>
            </div>

            {/* Category Breakdown */}
            {categoryData.length > 0 && (
                <div className="glass-card fade-in" style={{ padding: '1.5rem', animationDelay: '300ms' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '700' }}>
                        Spending by Category
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {categoryData.map(({ category, amount, percentage }) => (
                            <div key={category}>
                                <div className="flex-between mb-sm">
                                    <div className="flex gap-sm" style={{ alignItems: 'center' }}>
                                        <span style={{ fontSize: '1.5rem' }}>{getCategoryIcon(category)}</span>
                                        <span style={{ fontWeight: '600' }}>{category}</span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: '700', fontSize: '1.05rem' }}>
                                            {formatCurrency(amount)}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
                                            {percentage.toFixed(1)}%
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div
                                    style={{
                                        height: '8px',
                                        backgroundColor: 'var(--bg-tertiary)',
                                        borderRadius: 'var(--radius-xl)',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <div
                                        style={{
                                            height: '100%',
                                            width: `${percentage}%`,
                                            backgroundColor: getCategoryColor(category),
                                            borderRadius: 'var(--radius-xl)',
                                            transition: 'width 0.5s ease-out',
                                            boxShadow: `0 0 10px ${getCategoryColor(category)}80`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
