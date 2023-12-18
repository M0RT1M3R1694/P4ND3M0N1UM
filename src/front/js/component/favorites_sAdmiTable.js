import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types"
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Favorites_sAdmiTable = ({ favorites }, ...props) => {

    const { store, actions } = useContext(Context)

    return (
        <section className="intro">
            <div className="h-100">
                <div className="mask d-flex align-items-center h-100 p-0">
                    <div className="container-job m-auto w-75">
                        <div className="row justify-content-center">
                            <div className="col-12">
                                <div className="card tableFavorites_sItems text-center">
                                    <div className="card-body cardBodyFavorites_s">
                                        <div className="table-responsive">
                                            <table className="table table-hover mb-0">
                                                <tbody>
                                                    <tr>
                                                        <th scope="row" className="text-center cell-size-jobs align-middle fs-5">{books.name}</th>
                                                        <td className="text-center users-cell-size align-middle  fs-5">
                                                            <button className="btn btn-login text-center" onClick={() => { actions.get_favorites_by_id(favorites.id) }}>
                                                                <i className="fa-solid fa-circle-info me-2" ></i>View Details
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
};

Favorites_sAdmiTable.propTypes = {
    favorites: PropTypes.object
}