import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router';

export default function NotFound() {
  return (
    <>
      <title>404 | ian</title>

      <Container sx={{ pt: 4, textAlign: 'center' }}>
        <Typography variant='h3'>404 Not Found</Typography>
        <Typography variant='body1' sx={{ pt: 4 }}>
          This page does not exist. <Link component={RouterLink} to='/'>Return to home</Link>?
        </Typography>
      </Container>
    </>
  )
};
