import Toolbar from "@mui/material/Toolbar";
import fetchLogoSvg from "../../assets/fetch-logo.svg";

export default function FetchLogo() {
  return (
    <Toolbar>
      <img src={fetchLogoSvg} className="logo fetch" alt="Fetch logo" />
    </Toolbar>
  );
}
