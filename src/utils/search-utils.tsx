import * as geolib from 'geolib';
import { SearchInputs } from '../components/SearchForm';
import { BoundingBox, SearchParams } from '../services/fetch-api-service';

export function getSearchParams(searchInputs: SearchInputs): SearchParams {
  const searchParams: SearchParams = {};

  if (searchInputs.breeds && searchInputs.breeds.length > 0) {
    searchParams.breeds = searchInputs.breeds;
  }

  if (searchInputs.ageMin) {
    searchParams.ageMin = searchInputs.ageMin;
  }

  if (searchInputs.ageMax) {
    searchParams.ageMax = searchInputs.ageMax;
  }

  if (searchInputs.sortBy && searchInputs.sortOrder) {
    searchParams.sort = `${searchInputs.sortBy}:${searchInputs.sortOrder}`;
  }

  if (searchInputs.size) {
    searchParams.size = searchInputs.size;
  }

  return searchParams;
}

export function getBoundingBox(
  latitude: number,
  longitude: number,
  distanceInMiles: number,
): BoundingBox {
  const distanceInMeters = distanceInMiles * 1609.344;
  const [southwestCoords, northeastCoords] = geolib.getBoundsOfDistance(
    { latitude, longitude },
    distanceInMeters,
  );
  return {
    bottom_left: {
      lat: southwestCoords.latitude,
      lon: southwestCoords.longitude,
    },
    top_right: {
      lat: northeastCoords.latitude,
      lon: northeastCoords.longitude,
    },
  };
}
