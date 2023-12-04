import React, { Component, useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../../img/logo.jpg"
import { Context } from "../store/appContext";

export const Footer = () => {
	const {store, actions} = useContext(Context)
	return(
	<footer className="footer mt-auto py-3 text-white">
		<div className="row me-0">
			<div className="col-lg-4 col-md-12 col-sm-12 text-center">
				<img src={logo} alt="Logo" className="m-auto logo-footer" />
			</div>

			<div className="col-lg-1 col-md-12 col-sm-12 text-center m-auto">
				<div className="col">
					<Link to="/users" className="link-footer text-decoration-none" hidden={store.buttons_admin_tech.user}>
						<span className="footer-span">COMUNITY</span>
					</Link>
				</div>

				<div className="col">
					<Link to="/books" className="link-footer text-decoration-none" hidden={store.buttons_admin_tech.book}>
						<span className="footer-span">BOOKS</span>
					</Link>
				</div>

				<div className="col">
					<Link to="/favorites_s/admi" className="link-footer text-decoration-none" hidden={store.buttons_admin_tech.favorites_admin}>
						<span className="footer-span">FAVORITES</span>
					</Link>
				</div>

				<div className="col">
					<Link to="/ourServices" className="link-footer text-decoration-none">
						<span className="footer-span">CATEGORIES</span>
					</Link>
				</div>

			</div>
			<div className="col-md-12 col-lg-2 col-sm-12 text-center m-auto">
				<div className="col">
					<span className="mb-0 fs-4">Pandemonium</span>
					<br></br>
				</div>
				<div className="col my-2 ">
					<span className="mb-0 fs-5">Join our community</span>
				</div>

			</div>
			<hr className="mt-2 hr-footer"></hr>
			<span className="text-center mt-3">© Copyright Pandemonium</span>
		</div>
	</footer >
)};