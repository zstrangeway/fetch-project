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

export default function Root() {
  const pageTitle = 'Fetch Dog Search';
  const dataFetchedRef = useRef(false);

  const [loggedIn, setLoggedIn] = useState<boolean>(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const [listBreedsLoading, setListBreedsLoading] = useState(true);
  const [dogListLoading, setDogListLoading] = useState(false);

  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);

  const searchDogs = async (searchInputs: SearchInputs) => {
    try {
      setDogListLoading(true);
      const searchResult = await FetchApiService.searchDogs(searchInputs);
      const dogsData = await FetchApiService.getDogs(searchResult.resultIds);
      setDogs(dogsData);
    } catch (e) {
      // TODO: Handle Error
      LoggingService.log(LogLevel.Error, 'Root searchDogs failed', e);
    } finally {
      setDogListLoading(false);
    }
  };

  const fetchInitialData = async () => {
    try {
      setListBreedsLoading(true);
      const breedsData = await FetchApiService.listDogBreeds();
      setBreeds(breedsData);
      searchDogs({});
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 401) {
        setLoggedIn(false);
      } else {
        // TODO: Handle Error
        LoggingService.log(LogLevel.Error, 'Root fetchInitialData failed', e);
      }
    } finally {
      setListBreedsLoading(false);
    }
  };

  const handleSearch = async (searchInputs: SearchInputs) => {
    searchDogs(searchInputs);
  };

  const handleLogin = async (name: string, email: string) => {
    try {
      setLoginLoading(true);
      await FetchApiService.login({ name, email });
      setLoggedIn(true);
      fetchInitialData();
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

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
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
        />
      )}
      content={<DogCardList dogs={dogs} loading={dogListLoading} />}
    />
  );
}
