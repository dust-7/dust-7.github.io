import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';

interface SortBarsProps {
  array: number[];
  sortedIndices: number[];
  activeIndices: number[];
}

/** Bar height in pixels per value unit (value range is 0–100). */
const HEIGHT_SCALE = 3;

/** Minimum bar height in px so a zero-value bar is still visible. */
const MIN_BAR_HEIGHT = 4;

/**
 * Compute a bar's fill color based on its state and value.
 * - active → orange
 * - sorted → green
 * - unsorted → blue
 * Lightness increases with value magnitude.
 */
function barColor(value: number, isActive: boolean, isSorted: boolean): string {
  const t = value / 100; // 0–1 normalized

  if (isActive) {
    // Orange: #ff9800 base, lighten toward #fff
    const r = Math.round(255);
    const g = Math.round(153 + (204 - 153) * t);
    const b = Math.round(0 + (100 - 0) * t);
    return `rgb(${r},${g},${b})`;
  }

  if (isSorted) {
    // Green: #4caf50 base, lighten toward #fff
    const r = Math.round(76 + (200 - 76) * t);
    const g = Math.round(175 + (255 - 175) * t);
    const b = Math.round(80 + (200 - 80) * t);
    return `rgb(${r},${g},${b})`;
  }

  // Blue: #2196f3 base, lighten toward #fff
  const r = Math.round(33 + (220 - 33) * t);
  const g = Math.round(150 + (230 - 150) * t);
  const b = Math.round(243 + (255 - 243) * t);
  return `rgb(${r},${g},${b})`;
}

/** Glow color matching the bar's fill for hover/focus. */
function glowColor(value: number, isActive: boolean, isSorted: boolean): string {
  const t = value / 100;
  if (isActive) return `rgba(255,167,38,${0.5 + 0.4 * t})`;
  if (isSorted) return `rgba(102,187,106,${0.5 + 0.4 * t})`;
  return `rgba(66,165,245,${0.5 + 0.4 * t})`;
}

export default function SortBars({
  array,
  sortedIndices,
  activeIndices,
}: SortBarsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const isSortedSet = new Set(sortedIndices);
  const activeSet = new Set(activeIndices);

  const handleMouseEnter = useCallback((index: number) => {
    setHoveredIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  return (
    <Box
      data-testid="sort-bars"
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 0.5,
        height: '100%',
        minHeight: 200,
        width: '100%',
        padding: '8px 0',
        overflow: 'visible',
        // Ensure glow effects are not clipped
        '& > *': {
          overflow: 'visible',
        },
      }}
    >
      {array.map((value, index) => {
        const isSorted = isSortedSet.has(index);
        const isActive = activeSet.has(index);
        const isHovered = hoveredIndex === index;
        const heightPx = Math.max(MIN_BAR_HEIGHT, value * HEIGHT_SCALE);
        const color = barColor(value, isActive, isSorted);
        const glow = glowColor(value, isActive, isSorted);

        return (
          <Box
            key={index}
            data-testid={`bar-${index}`}
            data-value={value}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onFocus={() => setHoveredIndex(index)}
            onBlur={() => setHoveredIndex(null)}
            tabIndex={0}
            role="img"
            aria-label={`Value: ${value}`}
            sx={{
              flex: 1,
              height: `${heightPx}px`,
              backgroundColor: color,
              borderRadius: '2px 2px 0 0',
              transition: 'background-color 0.15s ease, height 0.1s ease, box-shadow 0.2s ease, transform 0.15s ease',
              boxShadow: isHovered
                ? `0 0 8px 2px ${glow}, 0 0 16px ${glow}`
                : 'none',
              transform: isHovered ? 'scaleY(1.03)' : 'scaleY(1)',
              outline: isHovered ? `2px solid ${glow}` : 'none',
              outlineOffset: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              // Ensure glow and tooltip are not clipped
              overflow: 'visible',
              isolation: 'isolate',
              '&:hover .bar-tooltip, &:focus .bar-tooltip': {
                opacity: 1,
                visibility: 'visible',
                transform: 'translateX(-50%) translateY(0) scale(1)',
              },
            }}
          >
            {/* Tooltip showing the value */}
            <Box
              className="bar-tooltip"
              sx={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%) translateY(4px) scale(0.9)',
                backgroundColor: '#2d2d2d',
                color: 'text.primary',
                padding: '4px 8px',
                borderRadius: 1,
                fontSize: '0.75rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                opacity: 0,
                visibility: 'hidden',
                transition: 'opacity 0.15s ease, transform 0.15s ease, visibility 0.15s',
                pointerEvents: 'none',
                boxShadow: `0 2px 8px rgba(0,0,0,0.4), 0 0 6px ${glow}`,
                zIndex: 10,
                mb: 0.5,
                // Ensure tooltip is not clipped
                overflow: 'visible',
              }}
            >
              {value}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
