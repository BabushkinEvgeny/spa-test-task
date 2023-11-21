import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { addUser } from "../../app/store/features/usersSlice";
import { AppDispatch } from "../../app/store/store";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddNewUser = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    password: "",
    is_active: true,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
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

  const handleAddUserClick = () => {
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

    dispatch(addUser(formData));

    setFormData({
      username: "",
      first_name: "",
      last_name: "",
      password: "",
      is_active: true,
    });
    navigate("/users-list");
  };

  return (
    <Box
      component="div"
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

      <Button variant="contained" onClick={handleAddUserClick}>
        Создать
      </Button>
      <Button variant="contained" onClick={goBack}>
        Скрыть форму
      </Button>
    </Box>
  );
};

export default AddNewUser;
