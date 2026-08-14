import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import TechStackWrapper from '../TechStackLayout.tsx';

export default function TechStack() {
  return (
    <TechStackWrapper>
      <Stack spacing={{ xs: 2, md: 8 }} direction={{ xs: 'column', md: 'row' }}>
        <Box sx={{ width: '50%' }}>
          <Typography variant='h4'>Frontend</Typography>
          <ul>
            <li>Source code</li>
            <li>Stack:
              <ul>
                <li>Vite</li>
                <li>React</li>
                <li>MUI</li>
              </ul>
            </li>
          </ul>
          <br />
          <Typography variant='h4'>Backend</Typography>
          <ul>
            <li><Link href='https://github.com/dust-7/dust-7-api/tree/main/src/checkpoint' target='_blank'>Source code</Link></li>
            <li><Link href='https://dust-7-api.vercel.app/api' target='_blank'>API (Swagger UI)</Link></li>
            <li>Stack:
              <ul>
                <li>Nestjs</li>
                <li>Redis</li>
                <li>Jest</li>
              </ul>
            </li>
          </ul>
        </Box>
        <Box>
          <Divider sx={{
            borderBottomWidth: { xs: 'thin', md: 0 },
            borderRightWidth: { xs: 0, md: 'thin' },
            height: { md: '100%' },
          }} />
        </Box>
        <Box>
          <Typography variant='body1'>
            This project demonstrates an integration with a public API (from LTA DataMall). To prevent excessive calls to the public API, photos are cached using Redis.
          </Typography>
          <br />
          <Typography variant='body1'>
            When a user visits this page, Redis is checked to see if a recent set of photos are cached. If it is available and cached less than 5 minutes ago, photos from the cache are served. Otherwise, fresh photos are fetched from the public API, cached, then served.
          </Typography>
        </Box>
      </Stack>
    </TechStackWrapper>
  );
};
