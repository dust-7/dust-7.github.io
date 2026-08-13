import { useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

export default function EnlargeableImage({ image, caption }: {
  image: string;
  caption: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Card>
        <CardActionArea onClick={() => setIsOpen(true)}>
          <CardMedia component='img' image={image} alt={caption} />
        </CardActionArea>
      </Card>
      <Typography variant='caption' component='div' align='center' sx={{ pt: 1 }}>
        {caption}
      </Typography>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        slotProps={{ backdrop: { sx: { backgroundColor: '#000c', backdropFilter: 'blur(4px)' } } }}
      >
        <>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '85%',
          }}>
            <img src={image} style={{
              width: '100%',
              height: '100%',
              'objectFit': 'contain',
            }} />
            <Typography variant='subtitle1' align='center'>{caption}</Typography>
          </Box>

          <IconButton
            aria-label='close'
            onClick={() => setIsOpen(false)}
            size='large'
            sx={{ position: 'absolute', top: 0, right: 0 }}
          >
            <CancelIcon fontSize='large' />
          </IconButton>
        </>
      </Modal>
    </>
  );
};