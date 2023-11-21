// ChangeUser component

import { Box, Button, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../app/store/store";
import { updateUser } from "../../app/store/features/usersSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangeUser = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  const user = location.state.user;
  const userId = user.id;

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        password: "",
      });
    }
  }, [user]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const goBack = () => {
    navigate("/users-list");
  };

  const validateUsername = (username: string) => {
    const usernameRegex = /^[A-Za-z0-9@.+\-_]{1,150}$/;
    return usernameRegex.test(username);
  };

  const validateName = (name: string) => {
    const nameRegex = /^[A-Za-z0-9@.+\-_]{1,150}$/;
    return nameRegex.test(name) || name == "";
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,128}$/;
    return passwordRegex.test(password);
  };
  const handleSave = async () => {
    if (!validateUsername(formData.username)) {
      toast(
        "Неверное имя пользователя. Он должен содержать от 1 до 150 символов и содержать только разрешенные символы."
      );
      return;
    }
    if (!validateName(formData.first_name)) {
      toast(
        "Неверное имя . Оно должно содержать от 1 до 150 символов и содержать только разрешенные символы.."
      );
      return;
    }
    if (!validateName(formData.last_name)) {
      toast(
        "Неверная фамилия пользователя. Она должна содержать от 1 до 150 символов и содержать только разрешенные символы."
      );
      return;
    }
    if (!validatePassword(formData.password)) {
      toast(
        "Неверный пароль пользователя. Он должен содержать от 1 до 150 символов и содержать только разрешенные символы.."
      );
      return;
    }

    if (userId) {
      await dispatch(updateUser({ userId, userData: formData }));
    }
    goBack();
  };

  return (
    <div>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <ToastContainer />
        <TextField
          name="username"
          label="Логин"
          value={formData.username}
          onChange={handleChange}
        />
        <TextField
          name="first_name"
          label="Имя"
          value={formData.first_name}
          onChange={handleChange}
        />
        <TextField
          name="last_name"
          label="Фамилия"
          value={formData.last_name}
          onChange={handleChange}
        />

        <TextField
          name="password"
          label="Пароль"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        <Button variant="contained" onClick={handleSave}>
          Сохранить
        </Button>
        <Button variant="contained" onClick={goBack}>
          Скрыть форму
        </Button>
      </Box>
    </div>
  );
};

export default ChangeUser;
