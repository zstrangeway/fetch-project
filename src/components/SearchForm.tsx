import { useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Divider } from '@mui/material';
import FetchTextField from './inputs/FetchTextField';
import FetchSelect from './inputs/FetchSelect';
import FetchMultiSelect from './inputs/FetchMultiSelect';

export interface SearchInputs {
  breeds?: string[];
  zipCode?: string;
  distance?: string;
  ageMin?: string;
  ageMax?: string;
  sortBy?: string;
  sortOrder?: string;
  size?: number;
}

export interface SearchFormProps {
  breeds: string[];
  logoutLoading: boolean;
  onLogout: () => void;
  onMatch: () => void;
  onSearch: (searchInputs: SearchInputs) => void;
}

const FORM_SPACING = 1;
const DISTANCE_OPTIONS = [
  { label: 'Any', value: '0' },
  { label: '25', value: '25' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
];
const SORT_FIELD_OPTIONS = [
  { label: 'Breed', value: 'breed' },
  { label: 'Age', value: 'age' },
  { label: 'Name', value: 'name' },
];
const PAGE_SIZE_OPTIONS = [
  { label: '25', value: 25 },
  { label: '50', value: 50 },
  { label: '100', value: 100 },
];
const SORT_ORDER_OPTIONS = [
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' },
];

export default function SearchForm(props: SearchFormProps) {
  const {
    breeds,
    logoutLoading,
    onLogout,
    onMatch,
    onSearch,
  } = props;
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [ageMin, setAgeMin] = useState<string>('');
  const [ageMax, setAgeMax] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [distance, setDistance] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(25);

  const breedOptions = breeds.map((breed) => ({ label: breed, value: breed }));

  const handleSearchClicked = () => {
    const searchInputs: SearchInputs = {
      breeds: selectedBreeds,
      zipCode,
      distance,
      ageMin,
      ageMax,
      sortBy,
      sortOrder,
      size: pageSize,
    };

    onSearch(searchInputs);
  };

  const handleResetClicked = async () => {
    setSelectedBreeds([]);
    setAgeMin('');
    setAgeMax('');
    setZipCode('');
    setDistance('');
    setSortOrder('');
    setSortBy('');
    setPageSize(25);
  };

  return (
    <>
      <Grid
        container
        spacing={FORM_SPACING}
        sx={{ p: FORM_SPACING, pt: FORM_SPACING * 2, pb: FORM_SPACING * 2 }}
      >
        <Grid item xs={12}>
          <FetchMultiSelect
            id="dog-breeds"
            label="Dog Breeds"
            onChange={(e) => setSelectedBreeds(e.target.value as string[])}
            options={breedOptions}
            value={selectedBreeds}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FetchTextField
            id="min-age"
            label="Min Age"
            onChange={(e) => setAgeMin(e.target.value)}
            value={ageMin}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FetchTextField
            id="max-age"
            label="Max Age"
            onChange={(e) => setAgeMax(e.target.value)}
            value={ageMax}
          />
        </Grid>

        {/* <Grid item xs={12} sm={6}>
          <FetchTextField
            id="zip-code"
            label="Zip Code"
            onChange={(e) => setZipCode(e.target.value)}
            value={zipCode}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FetchSelect
            id="distance"
            label="Distance"
            onChange={(e) => setDistance(e.target.value as string)}
            value={distance}
            options={DISTANCE_OPTIONS}
          />
        </Grid> */}

        <Grid item xs={6}>
          <FetchSelect
            id="sort-field"
            label="Sort Field"
            onChange={(e) => setSortBy(e.target.value as string)}
            value={sortBy}
            options={SORT_FIELD_OPTIONS}
          />
        </Grid>
        <Grid item xs={6}>
          <FetchSelect
            id="sort-order"
            label="Sort Order"
            onChange={(e) => setSortOrder(e.target.value as string)}
            value={sortOrder}
            options={SORT_ORDER_OPTIONS}
          />
        </Grid>

        <Grid item xs={12}>
          <FetchSelect
            id="page-size"
            label="Page Size"
            onChange={(e) => setPageSize(e.target.value as number)}
            value={pageSize}
            options={PAGE_SIZE_OPTIONS}
          />
        </Grid>

        <Grid item xs={6}>
          <Button
            color="secondary"
            variant="contained"
            fullWidth
            onClick={handleResetClicked}
          >
            Reset
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSearchClicked}
          >
            Search
          </Button>
        </Grid>
      </Grid>

      <Divider />

      <Grid
        container
        direction="column"
        flexGrow="1"
        spacing={FORM_SPACING}
        sx={{ p: FORM_SPACING, pt: FORM_SPACING * 2, pb: FORM_SPACING * 2 }}
      >
        <Grid item>
          { `Selected Dogs: ${0}` }
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            fullWidth
            onClick={onMatch}
          >
            Match
          </Button>
        </Grid>

        <Grid item flexGrow="1" />

        <Grid item>
          <Button
            color="secondary"
            variant="contained"
            fullWidth
            onClick={onLogout}
            disabled={logoutLoading}
          >
            Logout
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
