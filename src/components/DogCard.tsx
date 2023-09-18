import {
  Card, CardMedia, CardContent, Typography, Grid, IconButton,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Dog } from '../types/Dog';

interface DogCardProps {
  dog: Dog;
  selected: boolean;
  onSelectToggled: (id: string) => void;
}

export default function DogCard(props: DogCardProps) {
  const { dog, onSelectToggled, selected } = props;
  const {
    id,
    img,
    name,
    age,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    zip_code,
    breed,
  } = dog;
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card>
        <CardMedia
          sx={{ height: 200 }}
          image={img}
          title={`${name}, ${breed}`}
        />
        <CardContent sx={{ position: 'relative' }}>
          <Typography gutterBottom variant="h6" component="div">
            { name }
          </Typography>
          <Typography gutterBottom variant="subtitle1" component="div">
            { `${breed}, ${age} Years old` }
          </Typography>
          <Typography variant="body2" color="text">
            {`${zip_code}, 13 miles away`}
          </Typography>
          <IconButton
            color="error"
            sx={{ position: 'absolute', bottom: 0, right: 0 }}
            aria-label="select"
            onClick={() => onSelectToggled(id)}
          >
            {selected ? (
              <FavoriteIcon sx={{ height: 38, width: 38 }} />
            ) : (
              <FavoriteBorderIcon sx={{ height: 38, width: 38 }} />
            )}
          </IconButton>
        </CardContent>
      </Card>
    </Grid>
  );
}
