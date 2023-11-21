import React, { Fragment, useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../app/store/features/userSlice";
import { AppDispatch, RootState } from "../../app/store/store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.user.token);
  const status = useSelector((state: RootState) => state.user.status);
  const handleLogin = async () => {
    if (!validateUsername(username)) {
      toast(
        "Ошибка в логине! Логин должен быть менее 150 символов и содержать только буквы, цифры и специальные символы @ . + - _"
      );

      return;
    }

    if (!validatePassword(password)) {
      toast(
        "Неверный пароль. Он должен содержать от 8 до 128 символов и включать буквы, цифры и специальные символы."
      );
      return;
    }
    const actionResult = await dispatch(login({ username, password }));
    if (login.fulfilled.match(actionResult)) {
      console.log(actionResult.payload);
      navigate("/users-list");
    } else {
      toast("Ошибка при авторизации. Проверьте правильность введенных данных");
    }
  };
  const validateUsername = (username: string) => {
    return /^[A-Za-z0-9@.+\-_]{1,150}$/.test(username);
  };

  const validatePassword = (password: string) => {
    return /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,128}$/.test(
      password
    );
  };
  return (
    <Fragment>
      <Typography
        variant="h2"
        padding={3}
        fontFamily={"Poppins"}
        textAlign="center"
      >
        Авторизация
      </Typography>
      <ToastContainer />
      <TextField
        fullWidth
        margin="normal"
        label="login"
        variant="outlined"
        placeholder="Введите логин"
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        fullWidth
        margin="normal"
        type="password"
        label="password"
        variant="outlined"
        placeholder="Введите пароль"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        sx={{
          fontFamily: "Poppins",
          marginTop: 2,
          marginBottom: 2,
          width: "60%",
        }}
        variant="outlined"
        onClick={handleLogin}
      >
        Войти
      </Button>
    </Fragment>
  );
};

export default LoginPage;
