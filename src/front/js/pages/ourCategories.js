import React, { useContext, useEffect } from 'react'
import '../../styles/ourCategories.css'
import { OurCategoriesButtons } from '../component/ourCategoriesButtons'
import { OurCategoriesTableHeader } from '../component/ourCategoriesTableHeader';
import { OurCategoriesTable } from '../component/ourCategoriesTable'
import { OurCategoriesModal } from '../component/ourCategoriesModal';
import { Context } from '../store/appContext';

export const OurCategories = () => {

    const { store, actions } = useContext(Context)

    // useEffect(() => {
    //     actions.get_all_ourCategories()
    // }, [store.show_modal,])

    return (
        store.current_user == null ? <h1>Loading...</h1> :
            store.current_user == false ? <h1>You must login to view this page.</h1> :

                <>
                    <OurCategoriesButtons />
                    <OurCategoriesTableHeader />
                    {!!store.OurCategories && store.OurCategories.map((categories, index) => {
                        return (

                            <OurCategoriesTable key={index} categories={categories} />
                        )
                    })}
                    <OurCategoriesModal show={store.show_modal} />
                </>
    )
}

export default OurCategories

// const OurCategories = () => {

//     return (
//         store.current_user == null ? <h1>Loading...</h1> :
//             store.current_user == false ? <h1>You must login to view this page.</h1> :

//                 <div className='body1'>
//                     <div className='services'>
//                         <h1 className='tituloH1'>C4T3G0R13S</h1>
//                     </div>
//                     <div className='content-box-lg'>
//                         <div className='container'>
//                             <div className='row'>
//                                 <div className='col-md-6 col-sm-12 col-lg-3'>
//                                     <div className='item-service text-center'>
//                                         <div className='icon-service'>
//                                             <i className='icon-ourservices fa fa-desktop'></i>
//                                         </div>
//                                         <h4 className='tituloH2'>Mistery</h4>
//                                         <hr />
//                                         <p className=''>XXX</p>
//                                     </div>
//                                 </div>

//                                 <div className='col-md-6 col-sm-12 col-lg-3'>
//                                     <div className='item-service text-center'>
//                                         <div className='icon-service'>
//                                             <i className='icon-ourservices fa fa-tablet'></i>
//                                         </div>
//                                         <h4 className='tituloH2'>Thriller</h4>
//                                         <hr />
//                                         <p>XXX</p>
//                                     </div>
//                                 </div>

//                                 <div className='col-md-6 col-sm-12 col-lg-3'>
//                                     <div className='item-service text-center'>
//                                         <div className='icon-service'>
//                                             <i className='icon-ourservices fa fa-desktop'></i>
//                                         </div>
//                                         <h4 className='tituloH2'>Terror</h4>
//                                         <hr />
//                                         <p>XXX</p>
//                                     </div>
//                                 </div>

//                                 <div className='col-md-6 col-sm-12 col-lg-3'>
//                                     <div className='item-service text-center'>
//                                         <div className='icon-service'>
//                                             <i className='icon-ourservices fa fa-tablet'></i>
//                                         </div>
//                                         <h4 className='tituloH2'>XXX</h4>
//                                         <hr />
//                                         <p>XXX</p>
//                                     </div>
//                                 </div>


//                             </div>

//                         </div>



//                     </div>


//                 </div>
//     )
// }

