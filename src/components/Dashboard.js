import React, { useState, useEffect } from 'react';
import { db } from './Firebase';
import { ref, onValue } from 'firebase/database';
import { Card, CardContent, Typography, Grid, Box, Container, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format, parse, startOfMonth, endOfMonth, eachDayOfInterval, getYear, getMonth } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const un = localStorage.getItem('un');

  useEffect(() => {
    if (un) {
      const expensesRef = ref(db, `expenses/${un.replace('.', ',')}`);
      onValue(expensesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const expenseList = Object.entries(data).map(([id, expense]) => ({
            id,
            ...expense,
            date: new Date(expense.date)
          }));
          setExpenses(expenseList);
        } else {
          setExpenses([]);
        }
      });
    }
  }, [un]);

  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);

  const categoryData = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const pieChartData = Object.entries(categoryData).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  const topSpendingCategories = Object.entries(categoryData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, amount]) => ({ category, amount }));

  const expenseFrequency = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + 1;
    return acc;
  }, {});

  const frequencyChartData = Object.entries(expenseFrequency)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const getDayWiseData = (month, year) => {
    const startDate = startOfMonth(new Date(year, month));
    const endDate = endOfMonth(startDate);
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

    const categories = [...new Set(expenses.map(e => e.category))];

    return daysInMonth.map(day => {
      const dataPoint = { date: format(day, 'dd/MM') };
      categories.forEach(category => {
        dataPoint[category] = expenses
          .filter(e => e.category === category && 
                       getYear(e.date) === year && 
                       getMonth(e.date) === month && 
                       format(e.date, 'dd/MM') === format(day, 'dd/MM'))
          .reduce((sum, e) => sum + e.amount, 0);
      });
      return dataPoint;
    });
  };

  const getMonthlyData = (year) => {
    const monthlyData = expenses
      .filter(expense => getYear(expense.date) === year)
      .reduce((acc, expense) => {
        const month = getMonth(expense.date);
        acc[month] = (acc[month] || 0) + expense.amount;
        return acc;
      }, {});

    return Array.from({ length: 12 }, (_, i) => ({
      month: format(new Date(year, i), 'MMM'),
      amount: monthlyData[i] || 0
    }));
  };

  const lineChartData = getDayWiseData(getMonth(selectedMonth), getYear(selectedMonth));
  const monthlyChartData = getMonthlyData(selectedYear);

  return (
    <Container className="dashboard-container">
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5">Total Expenses: ${expenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h6">Spending Distribution</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h6">Top Spending Categories</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topSpendingCategories}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h6">Expense Frequency by Category</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={frequencyChartData}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card >
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="dashboard-card">
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Monthly Expenses</Typography>
                <FormControl variant="outlined" size="small">
                  <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="year-select"
                  >
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getMonthlyData(selectedYear)}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Daily Expenses</Typography>
                <FormControl variant="outlined" size="small">
                  <Select
                    value={selectedMonth.toISOString()}
                    onChange={(e) => setSelectedMonth(new Date(e.target.value))}
                    className="month-select"
                    renderValue={(selected) => format(new Date(selected), 'MMMM yyyy')}
                  >
                    {Array.from({ length: 12 }, (_, i) => new Date(new Date().getFullYear(), i, 1)).map(date => (
                      <MenuItem key={date.getTime()} value={date.toISOString()}>
                        {format(date, 'MMMM yyyy')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <ResponsiveContainer width="100%" height={400}>
              <LineChart data={getDayWiseData(getMonth(selectedMonth), getYear(selectedMonth))}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {Object.keys(lineChartData[0] || {}).filter(key => key !== 'date').map((category, index) => (
                    <Line 
                      type="monotone" 
                      dataKey={category} 
                      stroke={COLORS[index % COLORS.length]} 
                      key={category}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid><br/>
    </Container>
  );
}

export default Dashboard;