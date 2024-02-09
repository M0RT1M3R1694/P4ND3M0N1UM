import React, { useContext, useEffect } from 'react'
import '../../styles/login.css'
import logo from "../../img/logo.jpg"
import { Link, useNavigate } from 'react-router-dom'
import { Context } from '../store/appContext'

const Login = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate()

    useEffect(()=>{
        store.current_user ? navigate('/') : null
    },[store.current_user])

    return (
        <div className='container-login my-5 ' >
            
            <img src={logo} alt='logo' className='logo1 w-100' />

            <form className="form-login mt-3" onSubmit={e => {
                e.preventDefault()
               const res = actions.login_user()
               if (res == true){
                navigate("/")
               }
            }
            }>
                <input
                    className='form-control formControlLogin mb-3'
                    type='text'
                    placeholder='Username'
                    name='username'
                    onChange={actions.handle_change}
                />

                {/* password */}
                <input
                    className='form-control formControlLogin '
                    type='password'
                    placeholder='Password'
                    name='password'
                    onChange={actions.handle_change}
                />

                <div className='text-end me-2'>
                    <Link to="/forgotPass" className='form-label' onClick={() => actions.reset_hidden_username_question(false, true)}>
                        <span className='span-forgot text-white ms-auto'>F0RG0T P4SSW0RD?</span>
                    </Link>
                </div>

                <br></br>

                <div className='text-center'>

                    <button className='btnLogin btn'>L0G1N</button>
                    <Link to= "/signup">
                    <button className='btnLogin btn'>S1GN UP</button>
                    </Link>  
                </div>
            </form>

        </div>

    )
}

export default Login