import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export default function Body() {
  return (
    <Container>
      <Stack spacing={20}>
        <Box>
          <Typography variant='h2' gutterBottom>Hello!</Typography>
          <Typography variant='body1'>
            I'm Ian, a self-motivated Software Engineer with nearly 10 years of experience specializing in enterprise automation, API integration, and digital transformations.
          </Typography>
        </Box>
        <Box>
          <Typography variant='h2' gutterBottom>Technical Skills</Typography>
          <Typography variant='body1'>
            I love working with these:
          </Typography>
          <ul>
            <li><strong>Languages:</strong> JavaScript, TypeScript, Python, C#, Bash, SQL</li>
            <li><strong>Frameworks:</strong> React, Vite, Vitest, Next.js, NestJS, Jest, Swagger</li>
            <li><strong>Cloud & DevOps:</strong> AWS (EC2, S3, Lambda, DynamoDB, SNS, CloudWatch), CI/CD (Jenkins, GitHub Actions)</li>
            <li><strong>Databases:</strong> MS SQL, MongoDB</li>
            <li><strong>SaaS:</strong> Workato, Salesforce, NetSuite, GitHub</li>
          </ul>
        </Box>
      </Stack>
    </Container>
  );
};
