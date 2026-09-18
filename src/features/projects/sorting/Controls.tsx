import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import type { SortStatus } from './useSorter.ts';

interface ControlsProps {
  status: SortStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

/**
 * Start/Pause toggle and Reset buttons wired to the useSorter API via props.
 * The label flips between "Start" and "Pause" depending on `status`.
 * The toggle is disabled when status is 'done'.
 */
export default function Controls({ status, onStart, onPause, onReset }: ControlsProps) {
  const isDone = status === 'done';
  const isRunning = status === 'running';

  return (
    <Box data-testid="controls" sx={{ display: 'flex', gap: 1 }}>
      {isRunning ? (
        <Button
          data-testid="pause-btn"
          variant="outlined"
          color="primary"
          onClick={onPause}
          size="small"
        >
          Pause
        </Button>
      ) : (
        <Button
          data-testid="start-btn"
          variant="contained"
          color="primary"
          disabled={isDone}
          onClick={isDone ? undefined : onStart}
          size="small"
        >
          Start
        </Button>
      )}

      <Button
        data-testid="reset-btn"
        variant="outlined"
        color="inherit"
        onClick={onReset}
        size="small"
      >
        Reset
      </Button>
    </Box>
  );
}
