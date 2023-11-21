import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home";
import LoginPage from "./components/login";
import PrivateRouter from "./utils/router/privateRoute";
import UsersList from "./components/usersList";
import AddNewUser from "./components/addNewUser";
import ChangeUser from "./components/changeUser";
import Layout from "./layout";
import "./components/style.scss";
import { useDispatch } from "react-redux";
import { initializeUser } from "./app/store/features/userSlice";
import { AppDispatch } from "./app/store/store";
const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<LoginPage />} />
          <Route element={<PrivateRouter />}>
            <Route path="users-list" element={<UsersList />}>
              <Route path="add-new-user" element={<AddNewUser />} />
              <Route path="change-user" element={<ChangeUser />} />
            </Route>
          </Route>
        </Routes>
      </Layout>
    </>
  );
};

export default App;
