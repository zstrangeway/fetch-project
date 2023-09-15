import DogCardList from '../components/DogCardList';
import Layout from '../components/Layout';
import SearchForm from '../components/SearchForm';

export default function Root() {
  return (
    <Layout
      drawer={<SearchForm />}
      content={<DogCardList />}
    />
  );
}
