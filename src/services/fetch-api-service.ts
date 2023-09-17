import axios from 'axios';
import * as LoggingService from './logging-service';
import { LogLevel } from './logging-service';

const SERVICE_NAME = 'FetchApiService';
const BASE_URL = import.meta.env.VITE_APP_API_URL;

const httpClient = axios.create({
  withCredentials: true,
  baseURL: BASE_URL,
  paramsSerializer: {
    indexes: null,
  },
});

export interface LoginParams {
  name: string;
  email: string;
}

export const login = async (params: LoginParams): Promise<void> => {
  try {
    await httpClient.post('/auth/login', params);
  } catch (error) {
    LoggingService.log(LogLevel.Debug, `${SERVICE_NAME}.login()`, error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await httpClient.post('/auth/logout');
  } catch (error) {
    LoggingService.log(LogLevel.Debug, `${SERVICE_NAME}.logout()`, error);
    throw error;
  }
};

export const listDogBreeds = async (): Promise<string[]> => {
  try {
    const response = await httpClient.get<string[]>('/dogs/breeds');
    return response.data;
  } catch (error) {
    LoggingService.log(LogLevel.Debug, `${SERVICE_NAME}.listDogBreeds()`, error);
    throw error;
  }
};

export interface SearchParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: string;
  ageMax?: string;
  sort?: string;
  from?: number;
  size?: number;
}

interface SearchDogsResponse {
  next: string;
  resultIds: string[];
  total: number;
}

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export const searchDogs = async (params?: SearchParams): Promise<SearchDogsResponse> => {
  try {
    const response = await httpClient.get<SearchDogsResponse>(
      '/dogs/search',
      {
        params,
      },
    );
    return response.data;
  } catch (error) {
    LoggingService.log(LogLevel.Debug, `${SERVICE_NAME}.searchDogs()`, error);
    throw error;
  }
};

export const getDogs = async (params: string[]): Promise<Dog[]> => {
  try {
    const response = await httpClient.post<Dog[]>('/dogs', params);
    return response.data;
  } catch (error) {
    LoggingService.log(LogLevel.Debug, `${SERVICE_NAME}.getDogs()`, error);
    throw error;
  }
};

interface MatchDogsResponse {
  match: string;
}

export const matchDogs = async (params: string[]): Promise<string> => {
  try {
    const response = await httpClient.post<MatchDogsResponse>('/dogs/match', params);
    return response.data.match;
  } catch (error) {
    LoggingService.log(LogLevel.Debug, `${SERVICE_NAME}.matchDogs()`, error);
    throw error;
  }
};

export interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}

export const getLocations = async (params: string[]): Promise<Location[]> => {
  try {
    const response = await httpClient.post<Location[]>('/locations', params);
    return response.data;
  } catch (error) {
    LoggingService.log(LogLevel.Debug, `${SERVICE_NAME}.matchDogs()`, error);
    throw error;
  }
};

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface BoundingBox {
  bottom_left: Coordinates;
  top_right: Coordinates;
}

interface SearchLocationsParams {
  geoBoundingBox: BoundingBox;
  from?: number;
  size?: number;
}

interface SearchLocationsResponse {
  results: Location[];
  total: number;
}

export const searchLocations = async (
  params: SearchLocationsParams,
): Promise<SearchLocationsResponse> => {
  try {
    const response = await httpClient.post<SearchLocationsResponse>('/locations/search', params);
    return response.data;
  } catch (error) {
    LoggingService.log(LogLevel.Debug, `${SERVICE_NAME}.matchDogs()`, error);
    throw error;
  }
};
