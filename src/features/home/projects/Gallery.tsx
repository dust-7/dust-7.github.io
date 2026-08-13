import Grid from '@mui/material/Grid';

import ProjectCard from './ProjectCard';
import checkpointThumbnail from '../../../assets/checkpoint.jpg';

export default function Gallery() {
  const cards = [
    {
      link: '/projects/checkpoint',
      image: checkpointThumbnail,
      title: 'Checkpoint Traffic',
      description: 'View traffic conditions around the Singapore checkpoints towards Malaysia.',
    },
    {
      link: '#',
      title: 'Coming Soon',
      description: '',
    },
  ];

  return (
    <Grid
      container
      spacing={4}
      sx={{ pt: 4, justifyContent: 'center' }}
    >
      {cards.map((card, index) => (
        <Grid key={index}>
          <ProjectCard
            link={card.link}
            image={card.image}
            title={card.title}
            description={card.description}
          />
        </Grid>
      ))}
    </Grid>
  );
};
