import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { algorithms } from './algorithms/index.ts';

interface AlgorithmSelectorProps {
  /** Initially selected algorithm id (controlled parent may override via re-render). */
  defaultAlgorithm?: string;
  /** Called when user picks a different algorithm. */
  onSelectAlgorithm?: (id: string) => void;
  /** Current sort status from useSorter. */
  status?: 'idle' | 'running' | 'paused' | 'done';
}

/**
 * Renders one MUI button per registered algorithm, highlights the selection,
 * and displays an info panel whose content comes from the task-1 registry
 * (no hard-coded complexity data).
 */
export default function AlgorithmSelector({
  defaultAlgorithm = algorithms.keys().next().value!,
  onSelectAlgorithm,
  status = 'idle',
}: AlgorithmSelectorProps) {
  const [selectedId, setSelectedId] = useState<string>(defaultAlgorithm);

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedId(id);
      onSelectAlgorithm?.(id);
    },
    [onSelectAlgorithm],
  );

  const selectedMeta = algorithms.get(selectedId)?.meta;
  const isDisabled = status !== 'idle';

  return (
    <Box data-testid="algorithm-selector">
      {/* Algorithm buttons row */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          mb: 2,
        }}
      >
        {Array.from(algorithms.entries()).map(([id, entry]) => {
          const isSelected = id === selectedId;

          return (
            <Button
              key={id}
              data-testid={`algo-btn-${id}`}
              variant={isSelected ? 'contained' : 'outlined'}
              color={isSelected ? 'primary' : 'inherit'}
              onClick={() => handleSelect(id)}
              disabled={isDisabled}
              size="small"
              sx={{ textTransform: 'none' }}
            >
              {entry.meta.name}
            </Button>
          );
        })}
      </Box>

      {/* Info panel — data sourced from registry */}
      {selectedMeta && (
        <Box
          data-testid="algo-info-panel"
          sx={{
            backgroundColor: '#252525',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: 2,
            fontSize: '0.875rem',
          }}
        >
          <Grid container>
            <Grid size={{ xs: 4, md: 2, lg: 4 }}>
              <InfoRow label="Best Time" value={selectedMeta.timeMin} />
            </Grid>
            <Grid size={{ xs: 4, md: 2, lg: 4 }}>
              <InfoRow label="Avg Time" value={selectedMeta.timeAvg} />
            </Grid>
            <Grid size={{ xs: 4, md: 2, lg: 4 }}>
              <InfoRow label="Worst Time" value={selectedMeta.timeMax} />
            </Grid>
            <Grid size={{ xs: 4, md: 2, lg: 4 }}>
              <InfoRow label="Space" value={selectedMeta.space} />
            </Grid>
            <Grid size={{ xs: 4, md: 2, lg: 4 }}>
              <InfoRow
                label="Stable"
                value={selectedMeta.stable ? 'Yes' : 'No'}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}

/** Presentational row for the info panel. */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
        {label}
      </Typography>
      <Typography variant="body2" data-testid={`algo-${label.toLowerCase().replaceAll(' ', '-')}`}>
        {value}
      </Typography>
    </Box>
  );
}
