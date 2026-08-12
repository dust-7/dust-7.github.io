import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';

const listItems = [
  {
    icon: <LocationPinIcon />,
    text: 'Singapore',
  },
  {
    icon: <EmailIcon />,
    text: <Link
      href='mailto:ianleung7@gmail.com'
      color='inherit'
      underline='hover'
    >ianleung7@gmail.com</Link>,
  },
  {
    icon: <GitHubIcon />,
    text: <Link
      href='https://github.com/dust-7'
      target='_blank'
      color='inherit'
      underline='hover'
    >github.com/dust-7</Link>,
  },
];

export default function Footer() {
  return (
    <Container sx={{ pt: 10, pb: 2, width: 'fit-content' }}>
      <List sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        {listItems.map((item, index) => (
          <ListItem key={index} sx={{ justifyContent: 'center' }}>
            <ListItemIcon sx={{ color: 'text.secondary' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText disableTypography sx={{
              flex: 'none',
              fontSize: '0.8rem',
              color: 'text.secondary',
            }}>
              {item.text}
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};
