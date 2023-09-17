import { useEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import DogCardList from '../components/DogCardList';
import FetchLayout from '../components/layout/FetchLayout';
import SearchForm from '../components/SearchForm';
import type { SearchInputs } from '../components/SearchForm';
import * as LoggingService from '../services/logging-service';
import { LogLevel } from '../services/logging-service';
import * as FetchApiService from '../services/fetch-api-service';
import type { Dog } from '../types/Dog';
import Login from '../components/Login';
import { Location, SearchParams } from '../services/fetch-api-service';
import * as SearchUtils from '../utils/search-utils';

const defaultSarchInputs = {
  sortBy: 'breed',
  sortOrder: 'asc',
  size: 24,
}

export default function Root() {
  const pageTitle = 'Fetch Dog Search';
  const dataFetchedRef = useRef(false);
  
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [logoutLoading, setLogoutLoading] = useState<boolean>(false);
  const [listBreedsLoading, setListBreedsLoading] = useState<boolean>(true);
  const [dogListLoading, setDogListLoading] = useState<boolean>(false);
  
  const [loggedIn, setLoggedIn] = useState<boolean>(true);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);

  const [page, setPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(1);

  const [lastSearch, setLastSearch] = useState<SearchInputs>(defaultSarchInputs);

  const searchDogs = async (searchParams: SearchParams) => {
    try {
      setDogListLoading(true);
      const searchResult = await FetchApiService.searchDogs(searchParams);
      const dogsData = await FetchApiService.getDogs(searchResult.resultIds);
      setDogs(dogsData);
      setTotalResults(searchResult.total);
      setPageCount(
        Math.ceil(searchResult.total / (searchParams.size ?? defaultSarchInputs.size)),
      );
    } catch (e) {
      // TODO: Handle Error
      LoggingService.log(LogLevel.Error, 'Root searchDogs failed', e);
    } finally {
      setDogListLoading(false);
    }
  };

  const handleSearch = async (searchInputs: SearchInputs, newPage?: number) => {
    setLastSearch(searchInputs);
    const searchParams = SearchUtils.getSearchParams(searchInputs);

    if (searchInputs.distance && searchInputs.zipCode) {
      setDogListLoading(true);
      // Actaul max seems to be 135.
      // Setting max to 125 because I haven't researched root cause and want some breathing room.
      // There is likely a more graceful way to handle this, but it works for now.
      const maxZipCodesLength = 125;

      const locations = await FetchApiService.getLocations([searchInputs.zipCode]);
      const { latitude, longitude } = locations[0];
      const geoBoundingBox = await SearchUtils.getBoundingBox(
        latitude,
        longitude,
        searchInputs.distance,
      );

      // TODO: This block of code can potentially generate a lot of network requests.
      // Store search params and result to only call this code if the params change.
      let searchLocations: Location[] = [];
      const searchAllLocations = async (from?: number) => {
        const data = await FetchApiService.searchLocations({ geoBoundingBox, from, size: 100 });
        if (!data.results || !data.results.length) return;

        searchLocations = searchLocations.concat(data.results);

        if (searchLocations.length < data.total) {
          await searchAllLocations(searchLocations.length);
        }
      };
      await searchAllLocations();
      let zipCodes = searchLocations.map((location) => location.zip_code);

      if (zipCodes.length > maxZipCodesLength) {
        LoggingService.log(LogLevel.Info, `Found ${zipCodes.length} zip codes within range of your search.  The max number of zip codes allowed in this query is ${maxZipCodesLength}.  Truncating zip codes array to avoid error.`);
        zipCodes = zipCodes.slice(0, maxZipCodesLength);
      }
      searchParams.zipCodes = zipCodes;
    }

    if (newPage && newPage > 1) {
      searchParams.from = (newPage - 1) * (searchParams.size ?? defaultSarchInputs.size);
    }

    setPage(newPage ?? 1);
    searchDogs(searchParams);
  };

  const handleLogin = async (name: string, email: string) => {
    try {
      setLoginLoading(true);
      await FetchApiService.login({ name, email });
      setLoggedIn(true);
      handleSearch(defaultSarchInputs);
    } catch (e) {
      // TODO: Handle Error
      LoggingService.log(LogLevel.Error, 'Root handleLogin failed', e);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await FetchApiService.logout();
      setLoggedIn(false);
    } catch (e) {
      // TODO: Handle Error
      LoggingService.log(LogLevel.Error, 'Root handleLogout failed', e);
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleMatch = () => {
    try {
      // TODO
    } catch (e) {
      // TODO: Handle Error
      LoggingService.log(LogLevel.Error, 'Root handleMatch failed', e);
    } finally {
      // TODO
    }
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    newPage: number,
  ) => {
    handleSearch(lastSearch, newPage);
  };

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const fetchInitialData = async () => {
      try {
        setListBreedsLoading(true);
        const breedsData = await FetchApiService.listDogBreeds();
        setBreeds(breedsData);
        handleSearch(defaultSarchInputs);
      } catch (e) {
        if (isAxiosError(e) && e.response?.status === 401) {
          // Its a little janky... but simulates an auth check
          setLoggedIn(false);
        } else {
          // TODO: Handle Error
          LoggingService.log(LogLevel.Error, 'Root fetchInitialData failed', e);
        }
      } finally {
        setListBreedsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  if (listBreedsLoading) {
    return (
      <Grid
        container
        spacing={0}
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid item sx={{ flexGrow: 1, maxWidth: 300 }}>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  if (!loggedIn) {
    return (
      <Login onLogin={handleLogin} loading={loginLoading} />
    );
  }

  return (
    <FetchLayout
      title={pageTitle}
      drawer={(
        <SearchForm
          breeds={breeds}
          onMatch={handleMatch}
          onSearch={handleSearch}
          onLogout={handleLogout}
          logoutLoading={logoutLoading}
          totalResults={totalResults}
        />
      )}
      content={(
        <DogCardList
          dogs={dogs}
          loading={dogListLoading}
          onPageChange={handlePageChange}
          page={page}
          pageCount={pageCount}
        />
      )}
    />
  );
}
