'use client';

import { useState, useRef } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { useCategories } from '@/hooks/useCategories';
import { useAuth } from '@/components/AuthProvider';
import { useTheme } from '@/components/ThemeProvider';
import { useStorageMode } from '@/components/StorageModeProvider';
import { Expense } from '@/types/types';
import { filterExpensesByMonth } from '@/utils/calculations';
import Dashboard from '@/components/Dashboard';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import CategoryManager from '@/components/CategoryManager';
import LoginForm from '@/components/LoginForm';
import MonthlyStats from '@/components/MonthlyStats';

import Toast from '@/components/Toast';

export default function Home() {
  const { user, signOut, loading: authLoading, isConfigured } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { storageMode, setStorageMode, isSupabaseAvailable } = useStorageMode();
  const {
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
  } = useExpenses();

  const {
    categories,
    isLoading: categoriesLoading,
    addCategory,
    deleteCategory,
    resetToDefaults,
  } = useCategories();

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter expenses by selected month
  const filteredExpenses = filterExpensesByMonth(expenses, selectedMonth);

  const handleAddExpense = async (expenseData: {
    amount: number;
    category: string;
    date: string;
    description: string;
  }) => {
    try {
      await addExpense(expenseData);
      setToast({ message: 'Expense added successfully! 🚀', type: 'success' });
    } catch (error) {
      console.error('Error adding expense:', error);
      setToast({ message: 'Failed to add expense', type: 'error' });
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateExpense = (expenseData: {
    amount: number;
    category: string;
    date: string;
    description: string;
  }) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, expenseData);
      setEditingExpense(null);
      setToast({ message: 'Expense updated successfully! ✨', type: 'success' });
    }
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const success = await importExpenses(file);
      if (success) {
        setToast({ message: 'Expenses imported successfully! ✅', type: 'success' });
      } else {
        setToast({ message: 'Failed to import expenses. Please check the file format. ❌', type: 'error' });
      }
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClearAll = async () => {
    if (confirm('⚠️ Are you sure you want to delete ALL expenses? This cannot be undone.')) {
      await clearAllExpenses();
      setToast({ message: 'All expenses cleared! 🗑️', type: 'info' });
    }
  };

  const handleSyncToCloud = async () => {
    if (confirm('📤 Upload all local data to cloud? This will add your local expenses to Supabase.')) {
      const result = await syncLocalToCloud();
      setToast({
        message: result.message,
        type: result.success ? 'success' : 'error'
      });
    }
  };

  const handleSyncFromCloud = async () => {
    if (confirm('📥 Download cloud data to local storage? This will replace your local data.')) {
      const result = await syncCloudToLocal();
      setToast({
        message: result.message,
        type: result.success ? 'success' : 'error'
      });
    }
  };

  if (authLoading || isLoading || categoriesLoading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulse 1.5s infinite' }}>
            💰
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading your expenses...</p>
        </div>
      </div>
    );
  }

  // Show login form if Supabase is configured but user is not logged in
  if (isConfigured && !user) {
    return (
      <div className="container">
        <header className="text-center mb-xl" style={{ paddingTop: '2rem' }}>
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: '800',
              background: 'linear-gradient(135deg, var(--primary-light), var(--secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.5rem',
            }}
          >
            💰 Expense Tracker
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Track your daily expenses and manage your budget with ease
          </p>
        </header>
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <header className="text-center mb-xl">
        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '800',
            background: 'linear-gradient(135deg, var(--primary-light), var(--secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem',
          }}
        >
          💰 Expense Tracker
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Track your daily expenses and manage your budget with ease
        </p>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="btn btn-secondary btn-sm"
          style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            zIndex: 1000,
            padding: '0.75rem',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Storage Mode Toggle */}
        {isSupabaseAvailable && (
          <div
            style={{
              position: 'fixed',
              top: '1rem',
              right: '5rem',
              zIndex: 1000,
              display: 'flex',
              gap: '0.5rem',
              background: 'var(--bg-tertiary)',
              padding: '0.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
            }}
          >
            <button
              onClick={() => setStorageMode('local')}
              className="btn btn-sm"
              style={{
                padding: '0.5rem 1rem',
                background: storageMode === 'local' ? 'var(--primary)' : 'transparent',
                color: storageMode === 'local' ? 'white' : 'var(--text-secondary)',
                border: 'none',
              }}
              title="Use Local Storage (Device Only)"
            >
              💾 Local
            </button>
            <button
              onClick={() => setStorageMode('supabase')}
              className="btn btn-sm"
              style={{
                padding: '0.5rem 1rem',
                background: storageMode === 'supabase' ? 'var(--primary)' : 'transparent',
                color: storageMode === 'supabase' ? 'white' : 'var(--text-secondary)',
                border: 'none',
              }}
              title="Use Cloud Storage (Supabase)"
            >
              ☁️ Cloud
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-md" style={{ justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {isConfigured && user && (
            <div style={{
              padding: '0.5rem 1rem',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              👤 {user.email}
            </div>
          )}
          <button onClick={exportExpenses} className="btn btn-secondary btn-sm" disabled={expenses.length === 0}>
            📥 Export Data
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-secondary btn-sm"
          >
            📤 Import Data
          </button>
          <button
            onClick={handleClearAll}
            className="btn btn-danger btn-sm"
            disabled={expenses.length === 0}
          >
            🗑️ Clear All
          </button>
          {isSupabaseAvailable && (
            <>
              <button
                onClick={handleSyncToCloud}
                className="btn btn-secondary btn-sm"
                disabled={storageMode !== 'supabase' || !user}
                title="Upload local data to cloud"
              >
                📤 Sync to Cloud
              </button>
              <button
                onClick={handleSyncFromCloud}
                className="btn btn-secondary btn-sm"
                disabled={storageMode !== 'local' || !user}
                title="Download cloud data to local"
              >
                📥 Sync from Cloud
              </button>
            </>
          )}
          {isConfigured && user && (
            <button onClick={signOut} className="btn btn-secondary btn-sm">
              🚪 Logout
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </div>
      </header>

      {/* Expense Form - Moved to top for easy access */}
      <div className="mb-xl">
        {editingExpense ? (
          <ExpenseForm
            categories={categories}
            onSubmit={handleUpdateExpense}
            initialData={editingExpense}
            onCancel={handleCancelEdit}
          />
        ) : (
          <ExpenseForm categories={categories} onSubmit={handleAddExpense} />
        )}
      </div>

      {/* Dashboard */}
      <div className="mb-xl">
        <Dashboard categories={categories} expenses={selectedMonth ? filteredExpenses : expenses} />
      </div>

      {/* Monthly Stats */}
      <div className="mb-xl">
        <MonthlyStats
          expenses={expenses}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
      </div>

      {/* Category Manager */}
      <div className="mb-xl">
        <CategoryManager
          categories={categories}
          onAddCategory={addCategory}
          onDeleteCategory={deleteCategory}
          onResetCategories={resetToDefaults}
        />
      </div>

      {/* Expense List */}
      <ExpenseList
        categories={categories}
        expenses={filteredExpenses}
        onEdit={handleEditExpense}
        onDelete={deleteExpense}
      />

      {/* Footer */}
      <footer className="text-center" style={{ marginTop: '3rem', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
        <p>Built by Shaz • <a href="mailto:shazahmed290@gmail.com" style={{ color: 'var(--primary)', textDecoration: 'none' }}>shazahmed290@gmail.com</a></p>
      </footer>
    </div>
  );
}
