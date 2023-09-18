import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Stack } from '@mui/material';
import DogCard from './DogCard';
import { Dog } from '../types/Dog';

interface DogCardListProps {
  dogs: Dog[];
  loading: boolean;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  onSelectToggled: (id: string) => void;
  page: number;
  pageCount: number;
  selectedDogs: string[];
}

const SPACING = 2;

export default function DogCardList(props: DogCardListProps) {
  const {
    dogs,
    loading,
    onPageChange,
    onSelectToggled,
    page,
    pageCount,
    selectedDogs,
  } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) {
    return (
      <LinearProgress color="secondary" />
    );
  }

  return (
    <Stack alignItems="center">
      <Grid container spacing={SPACING}>
        {
          dogs.map((dog) => (
            <DogCard
              key={dog.id}
              dog={dog}
              onSelectToggled={onSelectToggled}
              selected={selectedDogs.indexOf(dog.id) > -1}
            />
          ))
        }
      </Grid>
      { pageCount > 1
        && (
        <Pagination
          sx={{ mt: SPACING * 2 }}
          color="primary"
          size={isMobile ? 'small' : 'medium'}
          hidePrevButton={isMobile}
          hideNextButton={isMobile}
          count={pageCount}
          showFirstButton
          showLastButton
          onChange={onPageChange}
          page={page}
        />
        )}
    </Stack>
  );
}
