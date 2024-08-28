import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './Firebase';
import { ref, onValue, remove, update } from 'firebase/database';
import { Container, Typography, Button, Card, CardContent, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ExpenseForm from './ExpenseForm';

function Home() {
  const [expenses, setExpenses] = useState([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [filter, setFilter] = useState('All');
  const [editingExpense, setEditingExpense] = useState(null);
  const navigate = useNavigate();
  const un = localStorage.getItem('un');

  useEffect(() => {
    if (!un) {
      navigate('/login');
    } else {
      const expensesRef = ref(db, `expenses/${un.replace('.', ',')}`);
      onValue(expensesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const expenseList = Object.entries(data).map(([id, expense]) => ({
            id,
            ...expense,
          }));
          setExpenses(expenseList);
        } else {
          setExpenses([]);
        }
      });
    }
  }, [un, navigate]);

  const handleDelete = (id) => {
    const expenseRef = ref(db, `expenses/${un.replace('.', ',')}/${id}`);
    remove(expenseRef);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleUpdate = (updatedExpense) => {
    const expenseRef = ref(db, `expenses/${un.replace('.', ',')}/${updatedExpense.id}`);
    update(expenseRef, updatedExpense);
    setEditingExpense(null);
    setShowExpenseForm(false);
  };

  const filteredExpenses = filter === 'All' 
    ? expenses 
    : expenses.filter(expense => expense.category === filter);

  const categories = ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Rent', 'Insurance', 'Healthcare', 'Education', 'Other'];

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Home</Typography>
      <Button variant="contained" color="primary" onClick={() => setShowExpenseForm(!showExpenseForm)}>
        {showExpenseForm ? 'Hide Expense Form' : 'Add New Expense'}
      </Button>
      {showExpenseForm && <ExpenseForm onClose={() => setShowExpenseForm(false)} editExpense={editingExpense} onUpdate={handleUpdate} />}
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Filter by Category</InputLabel>
        <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <MenuItem value="All">All</MenuItem>
          {categories.map(category => (
            <MenuItem key={category} value={category}>{category}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container spacing={2}>
        {filteredExpenses.map((expense) => (
          <Grid item xs={12} key={expense.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{expense.description}</Typography>
                <Typography>Amount: ${expense.amount}</Typography>
                <Typography>Category: {expense.category}</Typography>
                <Typography>Date: {expense.date}</Typography>
                <Button onClick={() => handleEdit(expense)}>Edit</Button>
                <Button onClick={() => handleDelete(expense.id)}>Delete</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home;