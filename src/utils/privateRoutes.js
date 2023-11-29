import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

const PrivateRoutes = ({role}) => {
    const user =  JSON.parse(localStorage.getItem("user_login")) ?? ""
    let auth = {'token': localStorage.getItem("jwt-token")}
    const isAuthenticated = (required_user) => {
        return auth.token && auth.role === required_user
    }

    return isAuthenticated(user) ? (
        <Outlet/>
    ):(
        <Navigate to="/"/>
    )
}

export default PrivateRoutes