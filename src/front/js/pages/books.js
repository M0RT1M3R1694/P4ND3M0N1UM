import React, { useContext, useEffect } from 'react'
import "../../styles/clients.css";
import { BooksTable } from '../component/booksTable';
import { BooksTableHeader } from '../component/booksTableHeader';
import { BooksButtons } from '../component/booksButtons';
import { Context } from '../store/appContext';
import { ClientsModal } from '../component/booksModal';

export const Books = () => {

    const { store, actions } = useContext(Context)

    useEffect(() => {
        actions.get_all_books()
    }, [store.show_modal])

    return (
        <>
            <BooksButtons />
            <BooksTableHeader />
            {!!store.books && store.books.map((book, index) => {
                return (
                    <BooksTable key={index} book={book} />
                )
            })}
            <BooksModal show={store.show_modal}/>
        </>
    )
}
