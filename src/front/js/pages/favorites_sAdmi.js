import React, { useContext, useEffect } from 'react'
import "../../styles/favorites_sAdmi.css";
import { Favorites_sAdmiButtons } from '../component/favorites_sAdmiButtons'
import { Favorites_sAdmiTableHeader } from '../component/favorites_sAdmiTableHeader';
import { Favorites_sAdmiTable } from '../component/favorites_sAdmiTable'
import { Favorites_sAdmiModal } from '../component/favorites_sAdmiModal';
import { Context } from '../store/appContext';

export const Favorites_sAdmi = () => {

    const { store, actions } = useContext(Context)

    useEffect(() => {
        actions.get_all_favorites_s()
    }, [store.show_modal, store.favorites_deleted])

    return (
        <>
            <Favorites_sAdmiButtons/>
            <Favorites_sAdmiTableHeader/>
            {!!store.favorites_s && store.favorites_s.map((favorites, index) => {
                return(

                    <Favorites_sAdmiTable key={index} favorites={favorites}/>
                    )
                })}
            <Favorites_sAdmiModal show={store.show_modal}/>
        </>
    )
}
