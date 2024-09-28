'use client'
import React, { useEffect, useState } from 'react';
import { Backdrop, CircularProgress } from '@mui/material'; // Material-UI components

let showSpinner;
let hideSpinner;

const ModalSpinner = () => {
  const [open, setOpen] = useState(false);

  // Expose the functions to control the spinner
  showSpinner = () => setOpen(true);
  hideSpinner = () => setOpen(false);

  // Clean up when the component unmounts
  useEffect(() => {
    return () => {
      hideSpinner = null;
      showSpinner = null;
    };
  }, []);

  return (
    <Backdrop open={open} style={{ zIndex: 1300 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

// Export the functions for external use
export { showSpinner, hideSpinner };
export default ModalSpinner;
