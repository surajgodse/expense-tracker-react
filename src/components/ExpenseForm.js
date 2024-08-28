import React, { useState, useEffect } from 'react';
import { db } from './Firebase';
import { ref, push, update } from 'firebase/database';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';

function ExpenseForm({ onClose, editExpense, onUpdate }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const un = localStorage.getItem('un');

  useEffect(() => {
    if (editExpense) {
      setAmount(editExpense.amount);
      setCategory(editExpense.category);
      setDate(editExpense.date);
      setDescription(editExpense.description);
    }
  }, [editExpense]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!un) {
      console.error("User not logged in");
      return;
    }
    const expenseData = {
      amount: parseFloat(amount),
      category,
      date,
      description,
    };
    if (editExpense) {
      onUpdate({ ...expenseData, id: editExpense.id });
    } else {
      const expenseRef = ref(db, `expenses/${un.replace('.', ',')}`);
      push(expenseRef, expenseData);
    }
    // Clear form
    setAmount('');
    setCategory('');
    setDate('');
    setDescription('');
    // Close the form
    onClose();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ '& > :not(style)': { m: 1 } }}>
      <TextField
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        required
        inputProps={{ min: "0", step: "0.01" }}
      />
      <FormControl fullWidth required>
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <MenuItem value="Food">Food</MenuItem>
          <MenuItem value="Transportation">Transportation</MenuItem>
          <MenuItem value="Entertainment">Entertainment</MenuItem>
          <MenuItem value="Utilities">Utilities</MenuItem>
          <MenuItem value="Rent">Rent</MenuItem>
          <MenuItem value="Insurance">Insurance</MenuItem>
          <MenuItem value="Healthcare">Healthcare</MenuItem>
          <MenuItem value="Education">Education</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        fullWidth
        required
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        rows={4}
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        {editExpense ? 'Update Expense' : 'Add Expense'}
      </Button>
    </Box>
  );
}

export default ExpenseForm;