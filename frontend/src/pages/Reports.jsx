import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  MenuItem,
  Divider,
  Stack,
  Chip,
} from '@mui/material';

import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [category, setCategory] = useState('ALL');

  const inventoryData = [
    { category: 'Food', value: 850000 },
    { category: 'Medicine', value: 520000 },
    { category: 'Cosmetics', value: 300000 },
    { category: 'Electronics', value: 680000 },
  ];

  const inventoryValueData = {
    labels: inventoryData.map((i) => i.category),
    datasets: [
      {
        label: 'Inventory Value (₹)',
        data: inventoryData.map((i) => i.value),
        backgroundColor: '#3b82f6',
        borderRadius: 8,
      },
    ],
  };

  const wastageData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Value Saved',
        data: [24000, 18000, 14000, 16000, 19000, 22000],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.15)',
        tension: 0.4,
      },
      {
        label: 'Wastage Loss',
        data: [12000, 9000, 7000, 6000, 5500, 4800],
        borderColor: '#ef4444',
        tension: 0.4,
      },
    ],
  };

  const exportExcel = () => {
    const sheetData = [
      ['Category', 'Inventory Value (₹)'],
      ...inventoryData.map((i) => [i.category, i.value]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, 'inventory-report.xlsx');
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Inventory Report', 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [['Category', 'Inventory Value (₹)']],
      body: inventoryData.map((i) => [i.category, i.value.toLocaleString()]),
    });

    doc.save('inventory-report.pdf');
  };

  return (
    <Box>
      {/* HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            System Reports
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Audit logs, financial summaries, and expiry analytics
          </Typography>
        </Box>
        <Button variant="contained" onClick={exportExcel}>
          Export All CSV
        </Button>
      </Box>

      {/* FILTER BAR */}
      <Paper sx={{ p: 2.5, mb: 4, borderRadius: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            type="date"
            label="From Date"
            InputLabelProps={{ shrink: true }}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <TextField
            type="date"
            label="To Date"
            InputLabelProps={{ shrink: true }}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <TextField
            select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="ALL">All Categories</MenuItem>
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Medicine">Medicine</MenuItem>
            <MenuItem value="Cosmetics">Cosmetics</MenuItem>
            <MenuItem value="Electronics">Electronics</MenuItem>
          </TextField>
          <Box flexGrow={1} />
          <Button variant="outlined" onClick={exportExcel}>
            Excel
          </Button>
          <Button variant="outlined" onClick={exportPDF}>
            PDF
          </Button>
        </Stack>
      </Paper>

      {/* CHARTS */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 360, borderRadius: 3 }}>
            <Typography fontWeight="bold" mb={2}>
              Inventory Value by Category
            </Typography>
            <Bar data={inventoryValueData} options={{ maintainAspectRatio: false }} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 360, borderRadius: 3 }}>
            <Typography fontWeight="bold" mb={2}>
              Wastage Reduction Trend
            </Typography>
            <Line data={wastageData} options={{ maintainAspectRatio: false }} />
          </Paper>
        </Grid>

        {/* 🔥 CRITICAL EXPIRY REPORT (LEFT) */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ borderRadius: 3, overflow: 'hidden', height: '100%' }}>
            <Box sx={{ p: 2.5, bgcolor: '#fee2e2' }}>
              <Typography fontWeight="bold" color="error">
                Critical Expiry Report
              </Typography>
              <Typography variant="caption" color="error">
                Items expiring within 30 days
              </Typography>
            </Box>

            <Divider />

            <Box sx={{ p: 2.5 }}>
              <Stack spacing={1.5}>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Fresh Milk 1L</Typography>
                  <Chip label="30 Jan 2026" color="error" size="small" />
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Pain Relief Tablets</Typography>
                  <Chip label="01 Dec 2025" color="warning" size="small" />
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Cheddar Cheese</Typography>
                  <Chip label="26 Jan 2026" color="error" size="small" />
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Face Moisturizer</Typography>
                  <Chip label="12 Feb 2026" color="warning" size="small" />
                </Box>
              </Stack>
            </Box>
          </Paper>
        </Grid>

        {/* ✅ RESTOCK RECOMMENDATIONS (RIGHT) */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ borderRadius: 3, overflow: 'hidden', height: '100%' }}>
            <Box sx={{ p: 2.5, bgcolor: '#fef3c7' }}>
              <Typography fontWeight="bold" color="#92400e">
                Restock Recommendations
              </Typography>
              <Typography variant="caption" color="#92400e">
                Items below threshold (20 units)
              </Typography>
            </Box>

            <Divider />

            <Box sx={{ p: 2.5 }}>
              <Stack spacing={2}>
                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <Typography fontWeight="500">Cheddar Cheese</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Supplier: DairyFarm Inc
                    </Typography>
                  </Box>
                  <Chip label="12" color="warning" size="small" />
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <Typography fontWeight="500">Face Moisturizer</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Supplier: BeautyCo
                    </Typography>
                  </Box>
                  <Chip label="8" color="warning" size="small" />
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <Typography fontWeight="500">Pain Relief Tablets</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Supplier: MediLife Ltd
                    </Typography>
                  </Box>
                  <Chip label="15" color="warning" size="small" />
                </Box>
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;