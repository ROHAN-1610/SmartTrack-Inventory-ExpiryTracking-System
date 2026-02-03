import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Fab,
  Paper,
  Typography,
  IconButton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  CircularProgress,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import api from '../services/api';

const bubble = (role) => ({
  alignSelf: role === 'user' ? 'flex-end' : 'flex-start',
  bgcolor: role === 'user' ? 'primary.main' : 'grey.100',
  color: role === 'user' ? 'white' : 'text.primary',
  px: 1.5,
  py: 1,
  borderRadius: 2,
  maxWidth: '80%',
  boxShadow: role === 'user' ? '0 8px 24px rgba(59,130,246,.25)' : 'none',
});

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('HELP');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(() => ([
    { role: 'assistant', text: "Hi! I'm SmartTrack Assistant. Ask me about FEFO/FIFO, expiry alerts, or inventory insights." }
  ]));

  const listRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    }, 50);
    return () => clearTimeout(t);
  }, [open, messages]);

  const title = useMemo(() => mode === 'INVENTORY' ? 'Inventory Assistant' : 'Help Assistant', [mode]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat', { message: text, mode });
      setMessages((m) => [...m, { role: 'assistant', text: res.data.reply }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', text: 'Sorry, I could not respond. Check backend is running.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <Fab
          color="primary"
          onClick={() => setOpen(true)}
          sx={{ position: 'fixed', right: 24, bottom: 24, zIndex: 1300, boxShadow: '0 18px 40px rgba(59,130,246,.35)' }}
        >
          <ChatIcon />
        </Fab>
      )}

      {open && (
        <Paper
          elevation={16}
          sx={{
            position: 'fixed',
            right: 18,
            bottom: 18,
            width: { xs: '92vw', sm: 380 },
            height: 520,
            zIndex: 1300,
            borderRadius: 3,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {mode === 'INVENTORY' ? <AutoAwesomeIcon /> : <HelpOutlineIcon />}
              <Box>
                <Typography fontWeight="bold">{title}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Offline assistant (no API key required)
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 1.5 }}>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={mode}
              onChange={(e, v) => v && setMode(v)}
              fullWidth
            >
              <ToggleButton value="HELP">Help</ToggleButton>
              <ToggleButton value="INVENTORY">Inventory</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Divider />

          <Box
            ref={listRef}
            sx={{
              flex: 1,
              overflowY: 'auto',
              px: 1.5,
              py: 1.5,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.25,
              bgcolor: '#f7f7fb',
            }}
          >
            {messages.map((m, idx) => (
              <Box key={idx} sx={bubble(m.role)}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{m.text}</Typography>
              </Box>
            ))}
            {loading && (
              <Box sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <CircularProgress size={16} />
                <Typography variant="caption">Thinking…</Typography>
              </Box>
            )}
          </Box>

          <Divider />

          <Box sx={{ p: 1.5, display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder={mode === 'INVENTORY' ? "e.g., items expiring in 14 days" : "e.g., what is FEFO?"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') send();
              }}
            />
            <IconButton
              color="primary"
              onClick={send}
              disabled={loading || !input.trim()}
              sx={{
                bgcolor: 'rgba(59,130,246,.08)',
                '&:hover': { bgcolor: 'rgba(59,130,246,.12)' },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
}
