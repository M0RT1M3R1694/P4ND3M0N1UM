import React, { useContext, useEffect } from 'react'
import { Context } from '../store/appContext'
import PropTypes from "prop-types";

export const Favorites_sAdmiModal = (...props) => {

    const { store, actions } = useContext(Context)

    useEffect(() => {
        actions.get_all_books()
        actions.get_all_users()
    }, [])

    return (
        <form className='modal' id="exampleModal" tabIndex="-1" style={{ display: store.show_modal ? "inline-block" : "none" }} onSubmit={(e) => {
            e.preventDefault()
            if (!!store.favorites_id) {
                actions.update_jfavorites_by_id(store.favorites_id.id)
                e.target.reset()
            } else {
                actions.add_favorites()
                e.target.reset()
            }
        }}>
            <div className="modal-dialog modal-dialog-centered p-1 fs-5">
                <div className="modal-content favorites_sModalContent p-2">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold fs-5">Favorites</h5>
                        <button type="reset" className="close btn btn-login fw-bold text-center fw-bold fs-5"
                            onClick={() => { actions.handle_delete_modal() }}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group mb-2">
                            <label htmlFor="userId" className="modal-label-input"
                                hidden={store.hidden_id} >Favorites ID {!!store.favorites_id ? store.favorites_id.id : ""}
                            </label>
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="type" className="modal-label-input">Type</label>
                            <div className="input-group group-favorites-modal mb-3 input-select">
                                <select className="form-select select-favorites_s-modal" id="inputGroupTypes" onChange={actions.handle_change} name='type'>
                                    <option className='option-favorites-modal' defaultValue="null">Select the type</option>
                                    <option className='option-favorites-modal'
                                        selected={!!store.favorites_id && store.favorites_id.type == "horror" ? true : false}
                                        value="horror" >Horor
                                    </option>
                                    <option className='option-favorites-modal'
                                        selected={!!store.favorites_id && store.jfavorites_id.type == "comedy" ? true : false}
                                        value="comedy">Comedy
                                    </option>
                                    <option className='option-favorites-modal'
                                        selected={!!store.favorites_id && store.favorites_id.type == "poetry" ? true : false}
                                        value="poetry">Poetry
                                    </option>
                                    <option className='option-favorites-modal'
                                        selected={!!store.favorites_id && store.favorites_id.type == "fantasy" ? true : false}
                                        value="fantasy">Fantasy
                                    </option>
                                    <option className='option-favorites-modal'
                                        selected={!!store.favorites_id && store.favorites_id.type == "sci-fy" ? true : false}
                                        value="sci-fy">Sci-fy
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="book" className="modal-label-input">Book</label>
                            <div className="input-group group-favorites_s-modal mb-3 input-select">
                                <select className="form-select select-favorites_s-modal" id="inputGroupBook" onChange={actions.handle_change}
                                    name='book_id'>
                                    <option className='option-favorites-modal' defaultValue="null">Select the Book</option>
                                    {!!store.books && store.books.map((book, index) => {
                                        return (
                                            <option key={index}
                                                className='option-favorites-modal'
                                                selected={!!store.favorites_id && store.favorites_id.book.id == book.id ? true : false}
                                                value={book.id}>{book.id} - {book.description} {client.author}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className="form-group mb-2">
                            <label htmlFor="comments" className="modal-label-input">Comments</label>
                            <textarea
                                rows="3"
                                className="form-control formModalFavorites_s"
                                id="comments"
                                name="comments"
                                onChange={actions.handle_change}
                                defaultValue={!!store.favorites_id ? store.favorites_id.comments : ""}
                            />
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="time_stamp" className="modal-label-input" hidden={store.hidden_time_stamp}>
                                <i className="fa-regular fa-clock me-1">
                                </i>Time Stamp: {!!store.favorites_id ? new Date(store.favorites_id.time_stamp).toLocaleString() : ""}
                            </label>
                        </div>
                    </div>
                    <div className="modal-footer d-flex justify-content-center aligh-items-center">
                        <button type="submit" className="btn btn-login fw-bold text-center fs-5">
                            Save
                        </button>
                        <button type="button" className="btn btn-login fw-bold text-center fs-5"
                            hidden={store.hidden_btn_new_code}
                            onClick={() => { actions.random_code_favorites() }}>
                            New Code
                        </button>
                        <button type="reset" className="btn btn-login fw-bold text-center fs-5">
                            Clear
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}
Favorites_sAdmiModal.propTypes = {
    show: PropTypes.bool
}
Favorites_sAdmiModal.defaultProps = {
    show: false
}

