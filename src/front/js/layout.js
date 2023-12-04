import React, { useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/home";
import injectContext, { Context } from "./store/appContext";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { Books } from "./pages/books";
import Login from "./pages/login";
import ForgotPass from "./pages/fotgotPass";
import OurServices from "./pages/ourCategories";
import ChangePass from "./pages/changePass";
import { Favorites_sTechnical } from "./pages/favorites_sTechnical";
import { Users } from "./pages/users";
import { Favorites_sAdmi } from "./pages/favorites_sAdmi";
import BackToTopBtn from "./component/backToTopBtn";
import PrivateRoutes from "../../utils/privateRoutes";




//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    const { store, actions } = useContext(Context)

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<PrivateRoutes role={"admin"} />}>
                            <Route element={<Favorites_sAdmi />} path="/favorites/admi" />
                            <Route element={<Books />} path="/books" />
                            <Route element={<Users />} path="/users" />
                        </Route>
                        <Route element={<PrivateRoutes role={"technical"} />}>
                        </Route>
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
                <BackToTopBtn />
            </BrowserRouter>
        </div>
    );
};
export default injectContext(Layout);
