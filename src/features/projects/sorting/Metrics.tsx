import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface MetricsProps {
  comparisons: number;
  swaps: number;
  elapsedMs: number;
}

/**
 * Displays Comparisons, Swaps, and Elapsed time (seconds, rounded to 1 decimal)
 * from props, updating live each render.
 */
export default function Metrics({ comparisons, swaps, elapsedMs }: MetricsProps) {
  const elapsedSeconds = (elapsedMs / 1000).toFixed(1);

  return (
    <Box data-testid="metrics" sx={{ display: 'flex', gap: 3, fontSize: '0.875rem' }}>
      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Comparisons
        </Typography>
        <Typography data-testid="metric-comparisons" variant="h6" sx={{ color: 'text.primary' }}>
          {comparisons}
        </Typography>
      </Box>
      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Swaps
        </Typography>
        <Typography data-testid="metric-swaps" variant="h6" sx={{ color: 'text.primary' }}>
          {swaps}
        </Typography>
      </Box>
      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Elapsed
        </Typography>
        <Typography data-testid="metric-elapsed" variant="h6" sx={{ color: 'text.primary' }}>
          {elapsedSeconds} s
        </Typography>
      </Box>
    </Box>
  );
}
