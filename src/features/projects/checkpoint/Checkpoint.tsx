import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Gallery from './Gallery.tsx';
import TechStack from './TechStack.tsx';

export default function Checkpoint() {
  return (
    <>
      <title>Checkpoint | ian</title>

      <Container>
        <Typography variant='h3' sx={{ pt: 4 }} gutterBottom>Checkpoint Traffic Cameras</Typography>
        <Typography variant='body1'>The following images are live photos taken by LTA traffic cameras. These are useful for gauging the traffic conditions before crossing the checkpoints between Singapore and Malaysia.</Typography>
      </Container>
      <Gallery />

      <TechStack />
    </>
  );
};
