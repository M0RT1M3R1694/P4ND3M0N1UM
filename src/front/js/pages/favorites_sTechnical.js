import React, { useContext, useEffect } from 'react'
import "../../styles/favorites_sTechnical.css";
//import { Favorites_sTechnicalTable } from '../component/favorites_sTechnicalTable';
//import { Favorites_sTechnicalButtons } from '../component/favorites_sTechnicalButtons';
//import { Favorites_sTechnicalTableHeader } from '../component/favorites_sTechnicalTableHeader';
//import { Favorites_sTechnicalModal } from '../component/favorites_sTechnicalModal';
import { Context } from '../store/appContext';

export const Favorites_sTechnical = () => {

    const { store, actions } = useContext(Context)

    useEffect(() => {
        actions.get_favorites_by_technical(store.user_login.id)
    }, [store.show_modal])

    return (
        <>
            <Favorites_sTechnicalButtons />
            <Favorites_sTechnicalTableHeader />
            {!!store.favorites_s && store.favorites_s.map((favorites, index) => {
                return (
                    <Favorites_sTechnicalTable key={index} favorites={favorites} />
                )
            })}
            <Favorites_sTechnicalModal show={store.show_modal} />
        </>
    )
}
