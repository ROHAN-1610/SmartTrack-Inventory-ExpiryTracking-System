import React, { createContext, useContext, useMemo, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const ToastContext = createContext({ notify: () => {} });

export function ToastProvider({ children }) {
  const [state, setState] = useState({ open: false, message: '', severity: 'success' });

  const notify = (message, severity = 'success') => {
    setState({ open: true, message, severity });
  };

  const value = useMemo(() => ({ notify }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={2500}
        onClose={() => setState((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={state.severity} variant="filled" sx={{ width: '100%' }}>
          {state.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
