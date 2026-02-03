import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { inventoryAPI } from '../services/api';
import { format } from 'date-fns';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/ToastProvider';

const InventoryList = () => {
  const toast = useToast();
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const [form, setForm] = useState({
    product: { id: 1 },
    batchNumber: '',
    quantity: 0,
    unitPrice: 0,
    manufacturingDate: '',
    expiryDate: '',
    storageLocation: '',
    notes: '',
  });

  useEffect(() => {
    fetchInventory();
    // eslint-disable-next-line
  }, [filter]);

  const filteredInventory = useMemo(() => {
    const base = inventory;
    if (!searchTerm) return base;
    return base.filter(
      (item) =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inventory, searchTerm]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      let response;
      if (filter === 'near-expiry') response = await inventoryAPI.getNearExpiry();
      else if (filter === 'expired') response = await inventoryAPI.getExpired();
      else response = await inventoryAPI.getAll();
      setInventory(response.data);
    } catch (error) {
      toast.notify('Failed to load inventory', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'GOOD':
        return 'success';
      case 'NEAR_EXPIRY':
        return 'warning';
      case 'EXPIRED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status, daysUntilExpiry) => {
    if (status === 'EXPIRED') return 'Expired';
    if (status === 'NEAR_EXPIRY') return `Near Expiry (${daysUntilExpiry}d)`;
    return `Good (${daysUntilExpiry}d)`;
  };

  const openAdd = () => {
    setEditing(null);
    setForm({
      product: { id: 1 },
      batchNumber: '',
      quantity: 0,
      unitPrice: 0,
      manufacturingDate: '',
      expiryDate: '',
      storageLocation: '',
      notes: '',
    });
    setFormOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      product: { id: row.productId },
      batchNumber: row.batchNumber,
      quantity: row.quantity,
      unitPrice: row.unitPrice || 0,
      manufacturingDate: row.manufacturingDate || '',
      expiryDate: row.expiryDate,
      storageLocation: row.storageLocation || '',
      notes: row.notes || '',
    });
    setFormOpen(true);
  };

  const save = async () => {
    try {
      if (!form.expiryDate) {
        toast.notify('Expiry date is required', 'warning');
        return;
      }
      if (editing) {
        await inventoryAPI.update(editing.id, form);
        toast.notify('Batch updated');
      } else {
        await inventoryAPI.create(form);
        toast.notify('Batch created');
      }
      setFormOpen(false);
      fetchInventory();
    } catch (e) {
      toast.notify('Save failed', 'error');
    }
  };

  const del = async (id) => {
    try {
      await inventoryAPI.delete(id);
      toast.notify('Deleted');
      setConfirm({ open: false, id: null });
      fetchInventory();
    } catch (e) {
      toast.notify('Delete failed', 'error');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Inventory Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track batches, expiry dates, and stock levels
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>
          Add Batch
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search by name, batch number..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 260 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button variant={filter === 'all' ? 'contained' : 'outlined'} onClick={() => setFilter('all')}>
          All Stock
        </Button>
        <Button
          variant={filter === 'near-expiry' ? 'contained' : 'outlined'}
          onClick={() => setFilter('near-expiry')}
          color="warning"
        >
          Near Expiry
        </Button>
        <Button
          variant={filter === 'expired' ? 'contained' : 'outlined'}
          onClick={() => setFilter('expired')}
          color="error"
        >
          Expired
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f7fa' }}>
            <TableRow>
              <TableCell><strong>Product Name</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Batch Info</strong></TableCell>
              <TableCell align="right"><strong>Qty</strong></TableCell>
              <TableCell><strong>Dates</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>{item.productName}</TableCell>
                <TableCell>{item.categoryName}</TableCell>
                <TableCell>
                  <Typography variant="body2">{item.batchNumber}</Typography>
                  {item.storageLocation && (
                    <Typography variant="caption" color="text.secondary">
                      {item.storageLocation}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell>
                  <Typography variant="body2">
                    Mfg: {item.manufacturingDate ? format(new Date(item.manufacturingDate), 'MMM dd, yyyy') : 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    Exp: {format(new Date(item.expiryDate), 'MMM dd, yyyy')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(item.status, item.daysUntilExpiry)}
                    color={getStatusColor(item.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" color="primary" onClick={() => openEdit(item)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => setConfirm({ open: true, id: item.id })}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Batch' : 'Add Batch'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Product ID (demo)"
                value={form.product.id}
                onChange={(e) => setForm((f) => ({ ...f, product: { id: Number(e.target.value) } }))}
                helperText="This demo uses Product IDs. Full product picker can be added next."
              >
                {[1,2,3,4,5].map((id) => (
                  <MenuItem key={id} value={id}>Product #{id}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Batch Number"
                value={form.batchNumber}
                onChange={(e) => setForm((f) => ({ ...f, batchNumber: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: Number(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Unit Price"
                value={form.unitPrice}
                onChange={(e) => setForm((f) => ({ ...f, unitPrice: Number(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Manufacturing Date"
                InputLabelProps={{ shrink: true }}
                value={form.manufacturingDate}
                onChange={(e) => setForm((f) => ({ ...f, manufacturingDate: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Expiry Date *"
                InputLabelProps={{ shrink: true }}
                value={form.expiryDate}
                onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Storage Location"
                value={form.storageLocation}
                onChange={(e) => setForm((f) => ({ ...f, storageLocation: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Notes"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirm.open}
        title="Delete batch?"
        message="This action cannot be undone."
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={() => del(confirm.id)}
      />
    </Box>
  );
};

export default InventoryList;
