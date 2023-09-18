import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Location } from "../services/fetch-api-service";
import { getDistanceBetween } from "../utils/search-utils";
import { Dog } from "../types/Dog";

interface DogCardProps {
  dog: Dog;
  inputZip?: number;
  locationMap: Record<number, Location>;
  onSelectToggled: (id: string) => void;
  selected: boolean;
}

export default function DogCard(props: DogCardProps) {
  const { dog, inputZip, locationMap, onSelectToggled, selected } = props;
  const {
    id,
    img,
    name,
    age,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    zip_code,
    breed,
  } = dog;
  const locationString = (): string => {
    if (!inputZip || !locationMap) return `Location: ${zip_code}`;
    const dist = Math.round(
      getDistanceBetween(inputZip, parseInt(zip_code, 10), locationMap),
    );
    return `Location: ${zip_code}, (${dist} miles)`;
  };

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card>
        <CardMedia
          sx={{ height: 200 }}
          image={img}
          title={`A ${age} year old ${breed}, named ${name}`}
        />
        <CardContent sx={{ position: "relative" }}>
          <Typography gutterBottom variant="h6" component="div">
            {name}
          </Typography>
          <Typography gutterBottom variant="subtitle1" component="div">
            {`${breed}, ${age} Years old`}
          </Typography>
          <Typography variant="body2" color="text">
            {locationString()}
          </Typography>
          <IconButton
            color="error"
            sx={{ position: "absolute", bottom: 0, right: 0 }}
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
