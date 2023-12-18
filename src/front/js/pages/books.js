import React, { useContext, useEffect } from 'react'
import "../../styles/books.css";
import { BooksTable } from '../component/booksTable';
import { BooksTableHeader } from '../component/booksTableHeader';
import { BooksButtons } from '../component/booksButtons';
import { Context } from '../store/appContext';
import { BooksModal } from '../component/booksModal';

export const Books = () => {

    const { store, actions } = useContext(Context)

    useEffect(() => {
        actions.fetchBook()
    }, [store.show_modal])
    console.log(store.book)

    return (
        store.current_user === null ? <h1>Loading...</h1> :
            store.current_user === false ? <h1>You must login to view this page.</h1> :
                <>
                    <BooksButtons />
                    <BooksTableHeader />
                    {!!store.books && store.book.map((book, index) => {
                        return (
                            <BooksTable key={index} book={book} />
                        )
                    })}
                    <BooksModal show={store.show_modal} />
                </>
    )
}
