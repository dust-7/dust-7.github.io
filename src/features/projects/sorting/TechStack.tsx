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
        <Box sx={{ width: { md: '50%' } }}>
          <Typography variant='h4'>Frontend</Typography>
          <ul>
            <li><Link href='https://github.com/dust-7/dust-7.github.io/tree/main/src/features/projects/sorting' target='_blank'>Source code</Link></li>
            <li><b>Stack:</b>
              <ul>
                <li>Vite</li>
                <li>React</li>
                <li>MUI</li>
              </ul>
            </li>
          </ul>
          <br />
          <Typography variant='h4'>Agentic Coding</Typography>
          <ul>
            <li><b>Docs:</b>
              <ul>
                <li><Link href='https://github.com/dust-7/dust-7.github.io/tree/main/src/features/projects/sorting/docs/plan.md' target='_blank'>plan.md</Link> - Implementation Plan</li>
                <li><Link href='https://github.com/dust-7/dust-7.github.io/tree/main/src/features/projects/sorting/docs/tasks.md' target='_blank'>tasks.md</Link> - Task List</li>
              </ul>
            </li>
            <li><b>Inference Engine:</b> llama.cpp</li>
            <li><b>LLM:</b> Qwen 3.6 35B A3B</li>
            <li><b>Coding Agent Harness:</b> Pi</li>
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
            This project demonstrates the capability to utilise agentic coding in creating a new feature in the codebase.
          </Typography>
          <br />
          <Typography variant='body1'>
            The project contains a sorting algorithms visualizer. Users get a visual representation of how different sorting algorithms work, and compare the efficiency between different algorithms.
          </Typography>
          <br />
          <Typography variant='body1'>
            Development started by writing a set of functional requirements for the feature, then generating an implementation plan (<Link href='https://github.com/dust-7/dust-7.github.io/tree/main/src/features/projects/sorting/docs/plan.md' target='_blank'>plan.md</Link>) with the coding agent, along with a list of actionable tasks (<Link href='https://github.com/dust-7/dust-7.github.io/tree/main/src/features/projects/sorting/docs/tasks.md' target='_blank'>tasks.md</Link>) to carry out the implementation. Finally, the coding agent tackled the tasks incrementally, with the changes manually reviewed.
          </Typography>
        </Box>
      </Stack>
    </TechStackWrapper>
  );
};
