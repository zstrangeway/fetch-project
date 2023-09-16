import { useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import FetchTextField from './inputs/FetchTextField';
import FetchSelect from './inputs/FetchSelect';
import FetchMultiSelect from './inputs/FetchMultiSelect';

export interface SearchInputs {
  breeds?: string[];
  zipCode?: string;
  ageMin?: string;
  ageMax?: string;
  sortBy?: 'asc' | 'desc';
  page?: string;
  size?: string;
}

export interface SearchFormProps {
  breeds: string[];
  onSearch: (searchInputs: SearchInputs) => void;
  onMatch: () => void;
}

const FORM_SPACING = 1;
const DISTANCE_OPTIONS = [
  { label: 'Any', value: '0' },
  { label: '25', value: '25' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
];
const SORT_ORDER_OPTIONS = [
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' },
];

export default function SearchForm(props: SearchFormProps) {
  const { breeds, onMatch, onSearch } = props;
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [ageMin, setAgeMin] = useState<string>('');
  const [ageMax, setAgeMax] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [distance, setDistance] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');

  const breedOptions = breeds.map((breed) => ({ label: breed, value: breed }));

  const handleSearchClicked = () => {
    const searchInputs: SearchInputs = {
      breeds,
      zipCode,
      ageMin,
      ageMax,
    };

    onSearch(searchInputs);
  };

  return (
    <Grid container spacing={FORM_SPACING} sx={{ p: FORM_SPACING }}>
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
      <Grid item xs={12}>
        <FetchSelect
          id="sort-order"
          label="Sort Order"
          onChange={(e) => setSortOrder(e.target.value as string)}
          value={sortOrder}
          options={SORT_ORDER_OPTIONS}
        />
      </Grid>
      <Grid item xs={6}>
        <Button color="secondary" variant="contained" fullWidth onClick={onMatch}>Match</Button>
      </Grid>
      <Grid item xs={6}>
        <Button variant="contained" fullWidth onClick={handleSearchClicked}>Search</Button>
      </Grid>
    </Grid>
  );
}
