import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Divider,
  ListItemAvatar,
} from '@mui/material';

import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Assessment as ReportIcon,
  Logout as LogoutIcon,
  Inventory2 as Inventory2Icon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { inventoryAPI } from '../services/api';

const drawerWidth = 240;

const Layout = ({ children, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // 🔔 Notification State
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const openNotif = Boolean(anchorEl);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await inventoryAPI.getAll();
      const items = res.data;

      const alerts = items
        .map(item => {
          if (item.status === 'EXPIRED') {
            return {
              id: item.id,
              type: 'expired',
              title: 'Item Expired',
              message: `${item.productName} (Batch ${item.batchNumber}) has expired!`,
              time: new Date(item.expiryDate),
            };
          }
          if (item.status === 'NEAR_EXPIRY') {
            return {
              id: item.id,
              type: 'near',
              title: 'Near Expiry Alert',
              message: `${item.productName} expires in ${item.daysUntilExpiry} days.`,
              time: new Date(),
            };
          }
          return null;
        })
        .filter(Boolean);

      setNotifications(alerts);
    } catch (err) {
      console.error('Failed to load notifications');
    }
  };

  const handleNotifClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotifClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Inventory List', icon: <InventoryIcon />, path: '/inventory' },
    { text: 'Reports & Audits', icon: <ReportIcon />, path: '/reports' },
  ];

  /* =======================
     SIDEBAR CONTENT
  ======================== */
  const drawer = (
    <Box
      sx={{
        height: '100%',
        backgroundColor: '#0f172a',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Toolbar sx={{ borderBottom: '1px solid #1e293b' }}>
        <Inventory2Icon sx={{ mr: 1, color: '#60a5fa' }} />
        <Typography variant="h6" fontWeight="bold">
          SmartTrack
        </Typography>
      </Toolbar>

      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderRadius: 2,
            backgroundColor: '#1e293b',
          }}
        >
          <Avatar sx={{ bgcolor: '#3b82f6' }}>A</Avatar>
          <Box>
            <Typography fontSize={14} fontWeight={600}>
              Admin User
            </Typography>
            <Typography fontSize={12} color="#94a3b8">
              Administrator
            </Typography>
          </Box>
        </Box>
      </Box>

      <List sx={{ px: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  my: 0.5,
                  borderRadius: 2,
                  color: isActive ? 'white' : '#94a3b8',
                  backgroundColor: isActive ? '#2563eb' : 'transparent',
                  '&:hover': {
                    backgroundColor: '#1e293b',
                    color: 'white',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ mt: 'auto', p: 2, borderTop: '1px solid #1e293b' }}>
        <ListItemButton
          onClick={onLogout}
          sx={{
            borderRadius: 2,
            color: '#94a3b8',
            '&:hover': {
              backgroundColor: '#1e293b',
              color: 'white',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Sign Out" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* =======================
          TOP APP BAR
      ======================== */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" fontWeight={600}>
              {menuItems.find((item) => item.path === location.pathname)?.text ||
                'SmartTrack Inventory'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* 🔔 Notification Bell */}
            <IconButton onClick={handleNotifClick}>
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={openNotif}
              onClose={handleNotifClose}
              PaperProps={{
                sx: {
                  width: 360,
                  maxHeight: 420,
                  borderRadius: 2,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography fontWeight={600}>Notifications</Typography>
                <Typography fontSize={12} color="text.secondary">
                  {notifications.length} New
                </Typography>
              </Box>

              <Divider />

              {notifications.length === 0 && (
                <Box sx={{ p: 2 }}>
                  <Typography fontSize={14} color="text.secondary">
                    No alerts 🎉
                  </Typography>
                </Box>
              )}

              <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                {notifications.map((n) => (
                  <MenuItem key={n.id} sx={{ alignItems: 'flex-start', gap: 1.5 }}>
                    <ListItemAvatar>
                      {n.type === 'expired' ? (
                        <ErrorOutlineIcon color="error" />
                      ) : (
                        <WarningAmberIcon color="warning" />
                      )}
                    </ListItemAvatar>

                    <Box>
                      <Typography fontSize={14} fontWeight={600}>
                        {n.title}
                      </Typography>
                      <Typography fontSize={13} color="text.secondary">
                        {n.message}
                      </Typography>
                      <Typography fontSize={11} color="text.disabled">
                        {new Date(n.time).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Box>
            </Menu>

            <Avatar sx={{ bgcolor: '#6366f1' }}>A</Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* =======================
          DRAWERS
      ======================== */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* =======================
          MAIN CONTENT
      ======================== */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;