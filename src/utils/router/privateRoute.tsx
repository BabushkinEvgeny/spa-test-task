import {Outlet, Navigate} from "react-router-dom";

const PrivateRoute = (props: any) => {
    const {auth} = props;
    return (
      auth ? <Outlet /> : <Navigate to="userlist" />
    );
};

export default PrivateRoute;