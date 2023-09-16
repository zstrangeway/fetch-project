import { Grid } from '@mui/material';
import DogCard from './DogCard';
import data from '../data/dogs';

export default function DogCardList() {
  const { dogs } = data;

  const dogCards = dogs.map((dog) => (<DogCard key={dog.id} dog={dog} />));

  return (
    <Grid container spacing={2}>
      { dogCards }
    </Grid>
  );
}
