'use client';

import React from 'react';
import { Expense } from '@/types/types';
import { formatCurrency, formatMonth, getAvailableMonths } from '@/utils/calculations';

interface MonthlyStatsProps {
    expenses: Expense[];
    selectedMonth: string | null;
    onMonthChange: (month: string | null) => void;
}

export default function MonthlyStats({ expenses, selectedMonth, onMonthChange }: MonthlyStatsProps) {
    const availableMonths = getAvailableMonths(expenses);

    // Calculate monthly totals
    const monthlyTotals: Record<string, number> = {};
    expenses.forEach((expense) => {
        const month = expense.date.substring(0, 7);
        monthlyTotals[month] = (monthlyTotals[month] || 0) + expense.amount;
    });

    // Get current month total
    const currentMonthTotal = selectedMonth ? monthlyTotals[selectedMonth] || 0 : 0;

    // Calculate month-over-month change
    const getMonthComparison = () => {
        if (!selectedMonth || availableMonths.length < 2) return null;

        const currentIndex = availableMonths.indexOf(selectedMonth);
        if (currentIndex === -1 || currentIndex === availableMonths.length - 1) return null;

        const previousMonth = availableMonths[currentIndex + 1];
        const previousTotal = monthlyTotals[previousMonth] || 0;
        const currentTotal = monthlyTotals[selectedMonth] || 0;

        if (previousTotal === 0) return null;

        const percentChange = ((currentTotal - previousTotal) / previousTotal) * 100;
        return {
            previousMonth,
            previousTotal,
            percentChange,
            isIncrease: percentChange > 0,
        };
    };

    const comparison = getMonthComparison();

    return (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div className="flex-between mb-lg">
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                    📅 Monthly Expenses
                </h3>
            </div>

            {/* Month Selector */}
            <div className="form-group">
                <label htmlFor="month-select" className="form-label">
                    Select Month
                </label>
                <select
                    id="month-select"
                    className="select"
                    value={selectedMonth || ''}
                    onChange={(e) => onMonthChange(e.target.value || null)}
                >
                    <option value="">All Months</option>
                    {availableMonths.map((month) => (
                        <option key={month} value={month}>
                            {formatMonth(month)} - {formatCurrency(monthlyTotals[month] || 0)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Current Month Stats */}
            {selectedMonth && (
                <div style={{ marginTop: '1.5rem' }}>
                    <div className="glass-card" style={{ padding: '1rem', background: 'var(--bg-tertiary)' }}>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                {formatMonth(selectedMonth)}
                            </p>
                            <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>
                                {formatCurrency(currentMonthTotal)}
                            </p>

                            {/* Month-over-month comparison */}
                            {comparison && (
                                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        vs {formatMonth(comparison.previousMonth)}
                                    </p>
                                    <p style={{
                                        fontSize: '1.1rem',
                                        fontWeight: '600',
                                        color: comparison.isIncrease ? 'var(--danger)' : 'var(--success)',
                                        marginTop: '0.25rem'
                                    }}>
                                        {comparison.isIncrease ? '↑' : '↓'} {Math.abs(comparison.percentChange).toFixed(1)}%
                                        <span style={{ fontSize: '0.875rem', marginLeft: '0.5rem' }}>
                                            ({comparison.isIncrease ? '+' : ''}{formatCurrency(currentMonthTotal - comparison.previousTotal)})
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Monthly Breakdown List */}
            {!selectedMonth && availableMonths.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                        All Months
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {availableMonths.slice(0, 6).map((month) => {
                            const total = monthlyTotals[month] || 0;
                            const maxTotal = Math.max(...Object.values(monthlyTotals));
                            const percentage = maxTotal > 0 ? (total / maxTotal) * 100 : 0;

                            return (
                                <div
                                    key={month}
                                    className="glass-card"
                                    style={{
                                        padding: '0.75rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onClick={() => onMonthChange(month)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                        e.currentTarget.style.borderColor = 'var(--primary)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateX(0)';
                                        e.currentTarget.style.borderColor = 'var(--border)';
                                    }}
                                >
                                    <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                                            {formatMonth(month)}
                                        </span>
                                        <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--primary)' }}>
                                            {formatCurrency(total)}
                                        </span>
                                    </div>
                                    <div style={{
                                        height: '4px',
                                        background: 'var(--bg-tertiary)',
                                        borderRadius: '2px',
                                        overflow: 'hidden',
                                    }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${percentage}%`,
                                            background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                                            transition: 'width 0.3s ease',
                                        }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {availableMonths.length > 6 && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'center' }}>
                            Showing 6 most recent months
                        </p>
                    )}
                </div>
            )}

            {availableMonths.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                    No expenses yet. Add some to see monthly statistics!
                </p>
            )}
        </div>
    );
}
