import React, { useState, useMemo, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../app/store/store";
import {
  fetchUsers,
  toggleUserActiveStatus,
  updateUser,
} from "../../app/store/features/usersSlice";
import { User, initializeUser } from "../../app/store/features/userSlice";

const UsersList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.users);
  const status = useSelector((state: RootState) => state.users.status);
  const error = useSelector((state: RootState) => state.users.error);
  const [sortAscending, setSortAscending] = useState(true);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
      dispatch(initializeUser());
    }
  }, [status, dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("token");
  };

  const sortedUsers = useMemo(() => {
    const sorted = [...users].sort((a, b) => {
      return sortAscending ? a.id - b.id : b.id - a.id;
    });
    return sorted.filter((user) =>
      user.username.toLowerCase().includes(filter.toLowerCase())
    );
  }, [users, sortAscending, filter]);

  const handleSortClick = () => {
    setSortAscending(!sortAscending);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const handleSettingsClick = (user: User) => {
    navigate("/users-list/change-user", { state: { user } });
  };

  const handleToggleActive = async (user: User) => {
    const resultAction = await dispatch(
      toggleUserActiveStatus({ userId: user.id, isActive: user.is_active })
    );

    if (toggleUserActiveStatus.fulfilled.match(resultAction)) {
      console.log("User active status toggled successfully");
    } else {
      if (resultAction.payload) {
        console.error("Failed to toggle active status: ", resultAction.payload);
      } else {
        console.error("Failed to toggle active status: ", resultAction.error);
      }
    }
  };

  return (
    <div className="users-list">
      <h1>Список пользователей</h1>
      {status === "loading" && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <Outlet />
      <TextField
        fullWidth={true}
        margin="normal"
        variant="outlined"
        placeholder="Фильтр по логину"
        value={filter}
        onChange={handleFilterChange}
      />
      <Button onClick={handleSortClick}>
        {sortAscending ? "Sort by ID (Desc)" : "Sort by ID (Asc)"}
      </Button>
      <Link to="/users-list/add-new-user">
        <Button>Добавить пользователя</Button>
      </Link>
      <Link to="/login" onClick={handleLogout}>
        <Button>Выйти из аккаунта</Button>
      </Link>
      <ul style={{ padding: 0 }}>
        <li className="user-item header">
          <span className="user-id">ID</span>
          <span className="user-name">Имя</span>
          <span className="user-username">Логин</span>
        </li>
        {sortedUsers.map((user) => (
          <li className="user-item" key={user.id}>
            <span className="user-id">{user.id}</span>
            <span className="user-name">
              {user.first_name} {user.last_name}
            </span>
            <span className="user-username">{user.username}</span>
            <Button onClick={() => handleToggleActive(user)}>
              {user.is_active ? "Deactivate" : "Activate"}
            </Button>
            <Button onClick={() => handleSettingsClick(user)}>Настройка</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
