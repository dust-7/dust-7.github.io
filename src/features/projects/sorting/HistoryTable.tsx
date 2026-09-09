import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import type { SortResult } from './useSorter.ts';

interface HistoryTableProps {
  history: SortResult[];
  onClear: () => void;
}

/**
 * Displays a table of completed sort runs with algorithm, comparisons, swaps,
 * and elapsed time. Includes a Clear button that is disabled when history is empty.
 */
export default function HistoryTable({ history, onClear }: HistoryTableProps) {

  return (
    <Box data-testid="history-table">
      <Table
        size="small"
        data-testid="history-table-body"
      >
        <TableHead>
          <TableRow>
            <TableCell>Algorithm</TableCell>
            <TableCell align="right">Comp.</TableCell>
            <TableCell align="right">Swaps</TableCell>
            <TableCell align="right">Elapsed</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history.map((row, index) => (
            <TableRow key={index} hover>
              <TableCell>{row.algorithm}</TableCell>
              <TableCell align="right">{row.comparisons}</TableCell>
              <TableCell align="right">{row.swaps}</TableCell>
              <TableCell align="right">{row.elapsedSeconds.toFixed(1)} s</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        data-testid="clear-history-btn"
        size="small"
        sx={{ mt: 1 }}
        disabled={history.length === 0}
        onClick={onClear}
      >
        Clear
      </Button>
    </Box>
  );
}
