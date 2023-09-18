import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Outlet } from "react-router-dom";

const themeConfig = {
  palette: {
    primary: {
      main: "#732384",
    },
    secondary: {
      main: "#fba91a",
    },
  },
};

export default function Root() {
  const theme = createTheme(themeConfig);

  return (
    <ThemeProvider theme={theme}>
      <Outlet />
    </ThemeProvider>
  );
}
