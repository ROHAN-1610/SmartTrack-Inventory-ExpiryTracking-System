import React, { useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { BrowserQRCodeReader } from '@zxing/browser';

const QRScannerDialog = ({ open, onClose, onScan }) => {
  const videoRef = useRef(null);
  const readerRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    readerRef.current = new BrowserQRCodeReader();

    readerRef.current.decodeFromVideoDevice(
      null,
      videoRef.current,
      (result) => {
        if (result) {
          onScan(result.getText());
        }
      }
    );

    return () => {
      readerRef.current?.stopContinuousDecode();
    };
  }, [open, onScan]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Scan QR Code
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <video ref={videoRef} style={{ width: '100%' }} />
      </DialogContent>
    </Dialog>
  );
};

export default QRScannerDialog;
