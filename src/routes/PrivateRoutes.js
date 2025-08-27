<<<<<<< HEAD
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const isLogged = true;
    return isLogged ? <Outlet/> : <Navigate to="/" />;
}

=======
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const isLogged = true;
    return isLogged ? <Outlet/> : <Navigate to="/" />;
}

>>>>>>> c106fa07a9c394b6cdd7708024a41fdea105aba6
export default PrivateRoute