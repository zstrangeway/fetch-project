import {
  Card, CardMedia, CardContent, Typography, CardActions, Button, Grid,
} from '@mui/material';
import { Dog } from '../types/Dog';

interface DogCardProps {
  dog: Dog;
}

export default function DogCard(props: DogCardProps) {
  const { dog } = props;
  const {
    img, name, age, zip_code, breed,
  } = dog;
  return (
    <Grid item xs={4}>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          sx={{ height: 140 }}
          image={img}
          title="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            { `${name}: ${age} - ${breed}` }
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Share</Button>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
