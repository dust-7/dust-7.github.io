import { Link as RouterLink } from 'react-router';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export default function ProjectCard({ link, image, title, description }: {
  link: string;
  image?: string;
  title: string;
  description: string;
}) {
  if (!image) image = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="100%" height="100%" fill="%23555"/></svg>';

  return (
    <Card sx={{ width: 300 }}>
      <CardActionArea
        component={RouterLink}
        to={link}
        sx={{ height: 440 }}
      >
        <CardMedia
          component='img'
          image={image}
          alt={title}
        />
        <CardContent>
          <Typography gutterBottom variant='h5' component='div'>
            {title}
          </Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
