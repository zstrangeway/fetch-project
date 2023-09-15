import { Grid } from '@mui/material';
import DogCard from './DogCard';
import data from '../data/dogs';

export default function DogCardList() {
  const { dogs } = data;

  const dogCards = dogs.map((dog) => (<DogCard dog={dog} />));

  return (
    <Grid container spacing={2}>
      { dogCards }
    </Grid>
  );
}
