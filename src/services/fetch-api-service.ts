import axios from 'axios';
import * as LoggingService from './logging-service';
import { LogLevel } from './logging-service';

const BASE_URL = import.meta.env.VITE_APP_API_URL;
const SERVICE_NAME = 'FetchApiService';

const httpClient = axios.create({
  withCredentials: true,
  baseURL: BASE_URL,
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
  page?: string;
  size?: number;
}

interface SearchDogsResponse {
  next: string;
  resultIds: string[];
  total: number;
}

interface Dog {
  id: string
  img: string
  name: string
  age: number
  zip_code: string
  breed: string
}

export const searchDogs = async (params?: SearchParams): Promise<SearchDogsResponse> => {
  console.log('params', params)
  try {
    const response = await httpClient.get<SearchDogsResponse>('/dogs/search', { params });
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
