import React, { useContext, useEffect } from 'react'
import '../../styles/forgotPass.css'
import logo from "../../img/logo.jpg"
import { Link, useNavigate} from 'react-router-dom'
import { Context } from '../store/appContext'

const ForgotPass = () => {
    const { store, actions } = useContext(Context)
    const navigate = useNavigate()

    useEffect(()=>{
        store.correct_answer ? navigate('/changePass'):null
    })

    return (
        <div className='container-forgot my-5'>
            <img src={logo} alt='logo' className='logo1 w-100' />

            <form className='form-forgot' hidden={store.hidden_username} onSubmit={(e)=>{
                e.preventDefault()
                actions.forgot_password()
            }}>
                <input
                    className='form-control formControlForgotPassword mb-3'
                    type='text'
                    placeholder='Username'
                    name='username'
                    onChange={actions.handle_change}
                />
                <div className='text-center'>
                    <button className='btnforgot btn mb-2 me-2'>CH3CK</button>
                    {/* <Link to="/login">
                        <button className='btnforgot btn '>C4NC3L</button>
                    </Link> */}
                </div>
            </form>
            <form className=" forgot mt-3" hidden={store.hidden_questions_answer} onSubmit={(e) => {
                e.preventDefault()
                actions.check_question_answer()
            }}>
                {/*Dop */}
                {/* <div className="input-group group-forgot-pass mb-3 input-select">
                    <select className="form-select select-forgot-pass" id="inputGroupQuestions" onChange={actions.handle_change} name='question_security'>
                        <option className='option-forgot-pass' defaultValue="null">Select the question</option>
                    </select>
                </div> */}

                {/* Respuesta */}
                {/* <input
                    className='form-control formControlForgotPassword mb-3'
                    type='text'
                    placeholder='Answer'
                    name='answer_security'
                    onChange={actions.handle_change}
                /> */}

                <div className='text-center'>
                    <button className='btnforgot btn'>C0NT1NU3</button>
                    <Link to="/login">
                        <button className='btnforgot btn ms-2'>C4NC3L</button>
                    </Link>
                </div>

            </form>

        </div>
    )
}

export default ForgotPass