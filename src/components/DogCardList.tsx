import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import DogCard from './DogCard';
import { Dog } from '../types/Dog';

interface DogCardListProps {
  dogs: Dog[];
  loading: boolean;
}

export default function DogCardList(props: DogCardListProps) {
  const { dogs, loading } = props;

  const dogCards = dogs.map((dog) => (<DogCard key={dog.id} dog={dog} />));

  if (loading) {
    return (
      <LinearProgress color="secondary" />
    );
  }

  return (
    <Grid container spacing={2}>
      { dogCards }
    </Grid>
  );
}
