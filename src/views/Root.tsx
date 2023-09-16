import DogCardList from '../components/DogCardList';
import Layout from '../components/Layout';
import SearchForm from '../components/SearchForm';
import type { SearchInputs } from '../components/SearchForm';
import * as LoggingService from '../services/logging-service';
import { LogLevel } from '../services/logging-service';

export default function Root() {
  const breeds = [
    'Chihuahua',
    'Labrador',
  ];

  const pageTitle = 'Fetch Dog Search';

  const handleSearch = (searchParams: SearchInputs) => {
    LoggingService.log(LogLevel.Debug, 'handleSearch', searchParams);
  };

  const onMatch = () => {
    LoggingService.log(LogLevel.Debug, 'onMatch');
  };

  return (
    <Layout
      title={pageTitle}
      drawer={<SearchForm breeds={breeds} onMatch={onMatch} onSearch={handleSearch} />}
      content={<DogCardList />}
    />
  );
}