
import React, { useState, useEffect } from 'react';
import { addExpense, getExpenses } from '../api';
import '../App.css';

const DashboardPage = ({ user, onLogout }) => {
  // State for expenses and form
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingExpenses, setLoadingExpenses] = useState(true);

  // Fetch expenses when component mounts or userId changes
  useEffect(() => {
    const fetchExpenses = async () => {
      setLoadingExpenses(true);
      try {
        const data = await getExpenses(user.email);
        setExpenses(data);
      } catch (err) {
        setError('Failed to load expenses');
      } finally {
        setLoadingExpenses(false);
      }
    };

    fetchExpenses();
  }, [user.email]);

  // Handle add expense form submission
  const handleAddExpense = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!title.trim() || !amount.trim()) {
        throw new Error('Title and amount are required');
      }

      // Call add expense API
      const newExpense = await addExpense(user.email, title, amount);

      // Add the new expense to the list
      setExpenses([newExpense, ...expenses]);

      // Clear form
      setTitle('');
      setAmount('');
    } catch (err) {
      setError(err.message || err);
    } finally {
      setLoading(false);
    }
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user.email}</h1>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-main">
        {/* Add Expense Form */}
        <section className="add-expense-section">
          <h2>Add New Expense</h2>
          <form onSubmit={handleAddExpense} className="add-expense-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                placeholder="Coffee, Groceries, Gas..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount ($)</label>
              <input
                id="amount"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Show error if add expense fails */}
            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="add-button" disabled={loading}>
              {loading ? 'Adding...' : 'Add Expense'}
            </button>
          </form>
        </section>

        {/* Expenses List */}
        <section className="expenses-section">
          <div className="expenses-header">
            <h2>Your Expenses</h2>
            {expenses.length > 0 && (
              <div className="total-amount">
                Total: <strong>${totalExpenses.toFixed(2)}</strong>
              </div>
            )}
          </div>

          {/* Loading state */}
          {loadingExpenses && <p className="loading-text">Loading your expenses...</p>}

          {/* Empty state */}
          {!loadingExpenses && expenses.length === 0 && (
            <p className="empty-state">
              No expenses yet. Add your first expense above!
            </p>
          )}

          {/* Expenses list */}
          {!loadingExpenses && expenses.length > 0 && (
            <div className="expenses-list">
              {expenses.map((expense) => (
                <div key={expense.id} className="expense-item">
                  <div className="expense-info">
                    <h3 className="expense-title">{expense.title}</h3>
                    <p className="expense-date">{formatDate(expense.created_at)}</p>
                  </div>
                  <div className="expense-amount">${parseFloat(expense.amount).toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;