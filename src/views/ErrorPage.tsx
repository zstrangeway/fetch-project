import { useRouteError } from "react-router-dom";

interface RouterError {
  message: string;
  statusText: string;
}

export default function ErrorPage() {
  const error: RouterError = useRouteError() as RouterError;

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
