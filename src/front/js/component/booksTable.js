import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types"
import { Link } from "react-router-dom";
import { BooksModal } from "./booksModal";
import { Context } from "../store/appContext";

export const BooksTable = ({ book }, ...props) => {

    const { store, actions } = useContext(Context)

    return (
        <section className="intro">
            <div className="h-100">
                <div className="mask d-flex align-items-center h-100 p-0">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-12">
                                <div className="card tableItems text-center">
                                    <div className="card-body cardBodyBooks">
                                        <div className="table-responsive">
                                            <table className="table table-hover mb-0">
                                                <tbody>
                                                    <tr>
                                                        <th scope="row" className="text-center align-middle fs-5">{book.id}</th>
                                                        <td className="text-center cell-size align-middle fs-5">{book.description}</td>
                                                        <td className="text-center cell-size align-middle fs-5">{book.author}</td>
                                                        <td className="text-center cell-size align-middle fs-5">
                                                            <button className="btn btn-login text-center" onClick={() => {actions.get_book_by_id(book.id)}}>
                                                                <i className="fa-regular fa-pen-to-square me-2"></i>Edit
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

BooksTable.propTypes = {
    book: PropTypes.object
}