import { useCallback } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import AlgorithmSelector from './AlgorithmSelector.tsx';
import Controls from './Controls.tsx';
import HistoryTable from './HistoryTable.tsx';
import Metrics from './Metrics.tsx';
import SortBars from './SortBars.tsx';
import TechStack from './TechStack.tsx';
import { useSorter } from './useSorter.ts';

export default function Sorting() {
  const {
    array,
    sortedIndices,
    activeIndices,
    status,
    metrics,
    history,
    setSelectedAlgorithm,
    start,
    pause,
    reset,
    clearHistory,
  } = useSorter();

  const handleSelectAlgorithm = useCallback(
    (id: string) => {
      setSelectedAlgorithm(id);
    },
    [setSelectedAlgorithm],
  );

  return (
    <>
      <title>Sorting Visualizer | ian</title>

      <Container maxWidth='xl'>
        <Typography variant='h3' sx={{ pt: 4, pb: 2 }} gutterBottom>
          Sorting Visualizer
        </Typography>

        <Grid container spacing={3}>
          {/* Section 1: Controls (AlgorithmSelector + Controls) */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper
                data-testid="controls-section"
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  flex: { md: 1 },
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  backgroundColor: '#1e1e1e',
                }}
            >
              <Stack spacing={2}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                  Controls
                </Typography>
                <AlgorithmSelector status={status} onSelectAlgorithm={handleSelectAlgorithm} />
                <Controls
                  status={status}
                  onStart={start}
                  onPause={pause}
                  onReset={reset}
                />
              </Stack>
            </Paper>
          </Grid>

          {/* Section 2: Metrics & Visualization */}
          <Grid size={{ xs: 12, md:6, lg: 4 }}>
            <Paper
                data-testid="visualization-section"
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  flex: { md: 2 },
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  backgroundColor: '#1e1e1e',
                }}
            >
              <Stack>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                  Visualization
                </Typography>
                <Metrics
                  comparisons={metrics.comparisons}
                  swaps={metrics.swaps}
                  elapsedMs={metrics.elapsedMs}
                />
                <Box
                  sx={{
                    mt: 3,
                    height: 300,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <SortBars
                    array={array}
                    sortedIndices={sortedIndices}
                    activeIndices={activeIndices}
                  />
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* Section 3: History */}
          <Grid size={{ xs: 12, md:6, lg: 4 }}>
            <Paper
              data-testid="history-section"
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                flex: { md: 1 },
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                backgroundColor: '#1e1e1e',
              }}
            >
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                Sort History
              </Typography>
              <HistoryTable history={history} onClear={clearHistory} />
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <TechStack />
    </>
  );
}
