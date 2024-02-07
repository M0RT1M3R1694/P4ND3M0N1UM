import React, { useContext } from 'react';
import { Context } from '../store/appContext'
import PropTypes from "prop-types";
import { Books } from '../pages/books';

export const BooksModal = (...props) => {

    const { store, actions } = useContext(Context)

    return (
        <form className="modal" tabIndex="-1" style={{ display: store.show_modal ? "inline-block" : "none" }} onSubmit={(e) => {
            e.preventDefault()
            if (!!store.book_id) {
                actions.update_book_by_id(store.book_id.id)
                e.target.reset()
            }
            else {
                actions.add_book()
                e.target.reset()
            }
        }
        }>
            <div className="modal-dialog modal-dialog-centered p-1">
                <div className="modal-content booksModalContent p-2">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">B00KS</h5>
                        <button type="reset" className="close btn btn-login fw-bold text-center fw-bold"
                            onClick={() => { actions.handle_delete_modal() }}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group mb-2">
                            <label htmlFor="bookId" className="modal-label-input" hidden={store.hidden_id}>B00K {!!store.book_id ? store.book_id.id : ""}</label>
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="firstName" className="modal-label-input">N4M3</label>
                            <input
                                type="text"
                                className="form-control formModalBooks"
                                id="firstName"
                                name="name"
                                onChange={actions.handle_change}
                                defaultValue={!!store.book_id ? store.book_id.name : ""}
                            />
                            <div className="form-group mb-2">
                                <label htmlFor="lastName" className="modal-label-input">D3SCR1PT10N</label>
                                <input
                                    type="text"
                                    className="form-control formModalBooks"
                                    id="lastName"
                                    name="description"
                                    onChange={actions.handle_change}
                                    defaultValue={!!store.book_id ? store.book_id.description : ""}
                                />
                            </div>
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="lastName" className="modal-label-input">4UTH0R</label>
                            <input
                                type="text"
                                className="form-control formModalBooks"
                                id="lastName"
                                name="author"
                                onChange={actions.handle_change}
                                defaultValue={!!store.book_id ? store.book_id.author : ""}
                            />
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="year" className="modal-label-input">Y34R</label>
                            <input
                                type="text"
                                className="form-control formModalBooks"
                                id="year"
                                name="year"
                                onChange={actions.handle_change}
                                defaultValue={!!store.book_id ? store.book_id.year : ""}
                            />
                        </div>
                    </div>
                    <div className="modal-footer d-flex justify-content-center aligh-items-center">
                        <button type="submit" className="btn btn-login fw-bold text-center" onClick={() => actions.addBookById(store.book_id)}>
                            Save
                        </button>
                        <button type="reset" className="btn btn-login fw-bold text-center" onClick={() => actions.handle_delete_modal()}>
                            Clear
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};
BooksModal.propTypes = {
    show: PropTypes.bool
}
BooksModal.defaultProps = {
    show: false
}