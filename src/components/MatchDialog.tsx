import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {
  Card, CardMedia, CardContent, Typography, IconButton, Avatar, CardHeader,
} from '@mui/material';
import { Dog } from '../types/Dog';
import { red } from '@mui/material/colors';

export interface SimpleDialogProps {
  match: Dog | null;
  onClose: () => void;
}

export default function MatchDialog(props: SimpleDialogProps) {
  const { match, onClose } = props;
  const open = match !== null;

  return (
    <Dialog onClose={onClose} open={open}>
      <Card sx={{ width: 400 }}>
        <CardHeader
          title="You have a Match!"
        />
        <CardMedia
          sx={{ height: 300 }}
          image={match?.img}
          title={`${match?.name}, ${match?.breed}`}
        />
        <CardContent sx={{ position: 'relative' }}>
          <Typography gutterBottom variant="h6" component="div">
            { match?.name }
          </Typography>
          <Typography gutterBottom variant="subtitle1" component="div">
            { `${match?.breed}, ${match?.age} Years old` }
          </Typography>
          <Typography variant="body2" color="text">
            {`${match?.zip_code}, 13 miles away`}
          </Typography>
        </CardContent>
      </Card>
    </Dialog>
  );
}
