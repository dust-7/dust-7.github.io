import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import styles from './Hero.module.css';

const text = `...
};
 
const me = {
    "name": "%Ian%",
    "role": "Software Engineer",
};
 
function next() {
...`;

export default function Hero() {
  const span1 = useRef<HTMLSpanElement>(null);
  const span2 = useRef<HTMLSpanElement>(null);
  const span3 = useRef<HTMLSpanElement>(null);
  const cursor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let isAborted = false;

    const spans = [
      span1,
      span2,
      span3,
    ];

    async function typewriter(text: string) {
      // reset state
      spans.forEach(span => {
        if (span.current) span.current.innerHTML = '';
      });
      if (cursor.current) cursor.current.hidden = false;

      let i = 0;
      let span = spans[i] as React.RefObject<HTMLSpanElement>;

      for (const char of text) {
        if (isAborted) return;

        if (char === '%') {
          // switch to next span
          // if (cursor.current) cursor.current.hidden = true;

          i++;
          span = spans[i] as React.RefObject<HTMLSpanElement>;

          continue;
        }

        if (span.current) span.current.innerHTML += char;

        await new Promise(resolve => setTimeout(resolve, 50));
      }

      if (cursor.current) cursor.current.hidden = true;
    };

    const timerId = setTimeout(() => {
      void typewriter(text);
    }, 1000);

    return () => {
      clearTimeout(timerId);
      isAborted = true;
    };
  }, []);

  return (
    <Box sx={{
      px: { xs: 1, md: 8 },
      py: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'radial-gradient(ellipse 80% 70% at top, #388e3c, transparent)',
    }}>
      <Paper elevation={0} className={styles['crt-screen']} sx={{
        p: { xs: 1, md: 8 },
        width: '100%',
        maxWidth: { xs: 500, md: 800 },
        backgroundColor: '#000',
        border: 2,
        borderColor: 'primary.light',
        boxShadow: '0 0 12px 2px #1b5e20, inset 0 0 60px rgba(0,0,0,0.5)',
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <Box component='pre' className={styles['crt-text-glow']} sx={{
          height: { xs: 265, md: 385 },
          color: 'grey.500',
          fontSize: { xs: '1.1rem', md: '1.6rem' },
          maskImage: 'linear-gradient(to bottom, transparent, black 40%, black 60%, transparent)',
        }}>
          <Typography component='span' ref={span1} sx={{ font: 'inherit' }} />
          <Typography component='span' ref={span2} sx={{ font: 'inherit', color: 'primary.main' }} />
          <Typography component='span' ref={span3} sx={{ font: 'inherit' }} />
          <Typography component='span' ref={cursor} sx={{ font: 'inherit' }}>|</Typography>
        </Box>
      </Paper>
    </Box>
  );
};
