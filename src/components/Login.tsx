import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import fetchLogoSvg from "../assets/fetch-logo.svg";
import FetchTextField from "./inputs/FetchTextField";

interface LoginProps {
  loading: boolean;
  onLogin: (name: string, email: string) => void;
}

const FORM_SPACING = 2;

export default function Login(props: LoginProps) {
  const { loading, onLogin } = props;
  const [name, setName] = useState("test"); // Adding default creds for convenience
  const [email, setEmail] = useState("test@test.com"); // Adding default creds for convenience

  return (
    <Grid
      container
      spacing={0}
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item sx={{ flexGrow: 1, maxWidth: 300 }}>
        <Card>
          <CardContent>
            <Grid
              container
              spacing={FORM_SPACING}
              direction="column"
              alignItems="center"
            >
              <Grid item>
                <img
                  src={fetchLogoSvg}
                  className="logo fetch"
                  alt="Fetch logo"
                />
              </Grid>
              <Grid item sx={{ width: 1 }}>
                <FetchTextField
                  id="name"
                  label="Name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  disabled={loading}
                />
              </Grid>
              <Grid item sx={{ width: 1 }}>
                <FetchTextField
                  id="email"
                  label="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  disabled={loading}
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions
            sx={{ p: FORM_SPACING, pt: 0, flexDirection: "row-reverse" }}
          >
            <Button
              color="primary"
              variant="contained"
              onClick={() => onLogin(name, email)}
              disabled={loading}
            >
              Login
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
}
