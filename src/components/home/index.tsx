import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Просто домашняя страница</h1>
      <Link to="/login">
        <Button
          type="submit"
          sx={{
            fontFamily: "Poppins",
            marginTop: 2,
            marginBottom: 2,
            width: "60%",
          }}
          variant="outlined"
        >
          Войти
        </Button>
      </Link>
    </div>
  );
};

export default Home;
