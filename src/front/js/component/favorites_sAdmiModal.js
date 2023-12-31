import React, { useContext, useEffect } from 'react'
import { Context } from '../store/appContext'
import PropTypes from "prop-types";

export const Favorites_sAdmiModal = (...props) => {

    const { store, actions } = useContext(Context)

    // useEffect(() => {
    //     actions.get_all_books()
    //     actions.get_all_users()
    // }, [])

    return (
        <form className='modal' id="exampleModal" tabIndex="-1" style={{ display: store.show_modal ? "inline-block" : "none" }} onSubmit={(e) => {
            e.preventDefault()
            if (!!store.favorites_id) {
                actions.update_favorites_by_id(store.favorites_id.id)
                e.target.reset()
            } else {
                actions.add_favorites()
                e.target.reset()
            }
        }}>
            <div className="modal-dialog modal-dialog-centered p-1 fs-5">
                <div className="modal-content favorites_sModalContent p-2">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold fs-5">F4V0R1T3S</h5>
                        <button type="reset" className="close btn btn-login fw-bold text-center fw-bold fs-5"
                            onClick={() => { actions.handle_delete_modal() }}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group mb-2">
                            {/* <label htmlFor="userId" className="modal-label-input"
                                hidden={store.hidden_id} > XXX {!!store.favorites_id ? store.favorites_id.id : ""}
                            </label> */}
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="type" className="modal-label-input">C4T3G0R13S</label>
                            <div className="input-group group-favorites-modal mb-3 input-select">
                                <select className="form-select select-favorites_s-modal" id="inputGroupTypes" onChange={actions.handle_change} name='type'>
                                    <option className='option-favorites-modal' defaultValue="null">S3L3CT TH3 C4T3G0R13S</option>
                                    <option className='option-favorites-modal'
                                        selected={!!store.favorites_id && store.favorites_id.type == "horror" ? true : false}
                                        value="horror" >H0RR0R
                                    </option>
                                    <option className='option-favorites-modal'
                                        selected={!!store.favorites_id && store.favorites_id.type == "gothic" ? true : false}
                                        value="horror" >G0THIC
                                    </option>
                                    <option className='option-favorites-modal'
                                        selected={!!store.favorites_id && store.favorites_id.type == "distopian" ? true : false}
                                        value="horror" >D1ST0P14N
                                    </option>
                                    <option className='option-favorites-modal'
                                        selected={!!store.favorites_id && store.favorites_id.type == "crime" ? true : false}
                                        value="horror" >CR1M3
                                    </option>
                                    {/* <option className='option-favorites-modal'
                                        selected={!!store.favorites_id && store.favorites_id.type == "horror" ? true : false}
                                        value="horror" >H0RR0R
                                    </option> */}
                                    <option className='option-favorites-modal'
                                        selected={!!store.favorites_id && store.favorites_id.type == "comedy" ? true : false}
                                        value="comedy">THR1LL3R
                                    </option>
                                    <option className='option-favorites-modal'
                                        selected={!!store.favorites_id && store.favorites_id.type == "poetry" ? true : false}
                                        value="poetry">M1ST3RY
                                    </option>
                                    <option className='option-favorites-modal'
                                        selected={!!store.favorites_id && store.favorites_id.type == "fantasy" ? true : false}
                                        value="fantasy">F4NT4SY
                                    </option>
                                    <option className='option-favorites-modal'
                                        selected={!!store.favorites_id && store.favorites_id.type == "sci-fy" ? true : false}
                                        value="sci-fy">SC1-FY
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="book" className="modal-label-input">B00K</label>
                            <div className="input-group group-favorites_s-modal mb-3 input-select">
                                <select className="form-select select-favorites_s-modal" id="inputGroupBook" onChange={actions.handle_change}
                                    name='book_id'>
                                    <option className='option-favorites-modal' defaultValue="null">S3L3CT TH3 B00k</option>
                                    {!!store.books && store.books.map((book, index) => {
                                        return (
                                            <option key={index}
                                                className='option-favorites-modal'
                                                selected={!!store.favorites_id && store.favorites_id.book.id == book.id ? true : false}
                                                value={book.id}>{book.id} - {book.description} {book.author}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className="form-group mb-2">
                            <label htmlFor="comments" className="modal-label-input">C0MM3NTS</label>
                            <textarea
                                rows="3"
                                className="form-control formModalFavorites_s"
                                id="comments"
                                name="comments"
                                onChange={actions.handle_change}
                                defaultValue={!!store.favorites_id ? store.favorites_id.comments : ""}
                            />
                        </div>
                        {/* <div className="form-group mb-2">
                            <label htmlFor="time_stamp" className="modal-label-input" hidden={store.hidden_time_stamp}>
                                <i className="fa-regular fa-clock me-1">
                                </i>Time Stamp: {!!store.favorites_id ? new Dates(store.favorites_id.time_stamp).toLocaleString() : ""}
                            </label>
                        </div> */}
                    </div>
                    <div className="modal-footer d-flex justify-content-center aligh-items-center">
                        <button type="submit" className="btn btn-login fw-bold text-center fs-5">
                            Save
                        </button>
                        {/* <button type="button" className="btn btn-login fw-bold text-center fs-5"
                            hidden={store.hidden_btn_new_code}
                            onClick={() => { actions.random_code_favorites() }}>
                            New Fav
                        </button>
                        <button type="reset" className="btn btn-login fw-bold text-center fs-5">
                            Clear
                        </button> */}
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

