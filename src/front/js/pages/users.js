import React, { useContext, useEffect } from 'react'
import "../../styles/users.css";
import { UsersTable } from '../component/usersTable';
import { UsersTableHeader } from '../component/usersTableHeader';
import { UsersButtons } from '../component/usersButtons';
import { UsersModal } from '../component/usersModal';
import { Context } from '../store/appContext';

export const Users = () => {
    const { store, actions } = useContext(Context)

    useEffect(() => {
        actions.fetchUsers()
    }, [store.show_modal, store.user_deleted])

    return (
        store.current_user === null ? <h1>Loading...</h1> :
            store.current_user === false ? <h1>You must login to view this page.</h1> :
                <>
                    <UsersButtons />
                    <UsersTableHeader />
                    {!!store.users && store.users.map((user, index) => {
                        return (
                            <UsersTable key={index} user={user} />
                        )
                    })}
                    <UsersModal show={store.show_modal} />
                </>
    )
}
