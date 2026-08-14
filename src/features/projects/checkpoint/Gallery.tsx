import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import { Fetch } from '../../../utils/fetch.ts';
import EnlargeableImage from '../../../components/EnlargeableImage.tsx';

const captions = {
  woodlands: {
    '1': 'Woodlands causeway',
    '2': 'Woodlands checkpoint',
    '3': 'Woodlands flyover',
  },
  tuas: {
    '1': 'After Tuas West Road',
    '2': 'Tuas Second Link',
    '3': 'Tuas checkpoint',
  },
};

const base = import.meta.env.VITE_API_BASE_URL as string;
const endpoint = '/checkpoint/{location}';

interface CheckpointImages {
  [key: string]: string;
};

interface CheckpointImagesCaptioned {
  [key: string]: {
    base64Image: string;
    caption: string;
  },
}

export default function Gallery() {
  const [location, setLocation] = useState<'woodlands' | 'tuas'>('woodlands');
  const [images, setImages] = useState<CheckpointImagesCaptioned>({});
  const [hasLoadError, setHasLoadError] = useState(false);

  useEffect(() => {
    setHasLoadError(false);

    const controller = new AbortController();

    const loadImages = async () => {
      try {
        const url = base + endpoint.replace('{location}', location);
        const checkpointImages = await Fetch.json(url, { signal: controller.signal }) as CheckpointImages;
        const checkpointImagesCaptioned: CheckpointImagesCaptioned = {};

        for (const [id, caption] of Object.entries(captions[location])) {
          checkpointImagesCaptioned[id] = {
            base64Image: checkpointImages[id],
            caption,
          };
        }

        setImages(checkpointImagesCaptioned);
      } catch (error) {
        if (error instanceof Error) {
          if (error.name !== 'AbortError') {
            console.error(error.message);
            setHasLoadError(true);
          }
        } else {
          console.error(error);
          setHasLoadError(true);
        }
      }
    };

    void loadImages();

    return () => controller.abort();
  }, [location]);

  return (
    <>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        pt: 4,
      }}>
        <ToggleButtonGroup
          value={location}
          exclusive
          color='primary'
          onChange={(_event, value) => setLocation(value)}
        >
          <ToggleButton value='woodlands'>
            Woodlands
          </ToggleButton>
          <ToggleButton value='tuas'>
            Tuas
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {hasLoadError ? (
        <Box sx={{ pt: 4 }}>
          <Typography variant='h5' color='error' align='center' gutterBottom>Could not load images</Typography>
          <Typography variant='body1' align='center'>Try again later</Typography>
        </Box>
      ) : (
        <Grid container spacing={4} sx={{ pt: 4, px: 1, justifyContent: 'center' }}>
          {Object.keys(images).length > 0 ? (
            Object.entries(images).map(([id, { base64Image, caption }]) => (
              <Grid key={id} sx={{ width: '100%', maxWidth: 500 }}>
                <EnlargeableImage image={`data:image/jpg;base64,${base64Image}`} caption={caption} />
              </Grid>
            ))
          ) : (
            [1, 2, 3].map(id => (
              <Grid key={id} sx={{ width: '100%', maxWidth: 500 }}>
                <Skeleton variant='rectangular' sx={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: 16 / 9,
                }} />
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Skeleton variant='text' sx={{
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    mt: 1,
                    width: '100px',
                  }} />
                </Box>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </>
  );
};
