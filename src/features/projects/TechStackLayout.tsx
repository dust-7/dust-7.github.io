import { useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

export default function TechStackLayout({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* spacing to accomodate floating button */}
      <Box sx={{ pb: { xs: 6, md: 12 } }}></Box>

      <Button
        variant='contained'
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: 'fixed',
          bottom: { xs: 0, md: 40 },
          width: { xs: '100%', md: 'auto' },
          left: { md: '50%' },
          transform: { md: 'translate(-50%, 0)' },
          zIndex: 1200,
        }}
      >
        {isOpen ? 'Hide' : 'Show'} Tech Stack
      </Button>

      <Modal
        open={isOpen}
        slotProps={{ backdrop: { sx: { backgroundColor: '#000c', backdropFilter: 'blur(4px)' } } }}
        sx={{ zIndex: 1100, overflow: 'auto' }}
      >
        <Box sx={{ pt: 4, pb: { xs: 6, md: 12 } }}>
          <Container>
            <Typography variant='h2' align='center' sx={{ py: 4 }}>Tech Stack</Typography>
            {children}
          </Container>
        </Box>
      </Modal>
    </>
  );
};
