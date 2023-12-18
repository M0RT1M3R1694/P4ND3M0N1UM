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
        actions.fetchFavorites()
    }, [store.show_modal])
    console.log(store.favorites)

    return (
            store.favorites === null ? <h1>Loading...</h1> :
            store.favorites === false ? <h1>You must login to view this page.</h1> :

        <>
            <Favorites_sAdmiButtons/>
            <Favorites_sAdmiTableHeader/>
            {!!store.favorites && store.favorites.map((favorites, index) => (

                    <Favorites_sAdmiTable key={index} favorites={favorites}/>
                ))}
            <Favorites_sAdmiModal show={store.show_modal}/>
        </>
    )
}
