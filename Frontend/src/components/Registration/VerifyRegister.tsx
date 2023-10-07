import { useState } from 'react';

import axios from 'axios';

const AUTH_API_KEY = import.meta.env.VITE_AUTH_API_KEY;

function VerifyRegister({ setAuthState, setNotification, setStatusNotification }:any) {

    document.title = "Verify Register"

    const notificationHandler = (message:string, status:string) => {
        setNotification(message);
        setStatusNotification(status);
        setTimeout(() => {
            setNotification("");
            setStatusNotification("");
        }, 2000);
    }

    const [code, setCode] = useState<string>("");

    const codeHandler = (e:any) => {
        setCode(e.target.value);
    }

    const handleSubmit = async (e:any) => {

        e.preventDefault();

        const data = {
            AUTH_PASSWORD: code,
            AUTH_API_KEY: AUTH_API_KEY,
        }

        // send a post request using axios
        await axios.post('/register/verifyMail', data)
        .then(() => {
            // console.log(res.data);
            setAuthState({
                showRegister: false,
                showLogin: false,
                showForgetPassword: false,
                showResetPassword: false,
                verifyRegister: false,
                verifyForgetPassword: false,
                showMainPage:true
            })
            notificationHandler("Email Verification Successfull", "success")
        }).catch(()=>{
            // console.log(err)
            notificationHandler("Email Verification Unsuccessfull", "error")
        })
    }

    document.title = "Register";
    return (
        <div className="flex flex-col justify-center items-center w-320px h-screen gap-10 tracking-wide">
            <h1 className="text-indigo-600 font-medium text-lg">Verify Email</h1>
            <form className="flex flex-col items-center gap-5 w-320px" onSubmit={handleSubmit}>
                <input type="text" id="username" name="username" value={code} className="border-solid border-2 border-indigo-600 p-2" placeholder="Enter CODE" required onChange={(e)=>codeHandler(e)}/>
                <button type="submit" className="bg-indigo-600 w-full p-2 text-white font-medium">Verify</button>
            </form>
        </div>
    )
}

export default VerifyRegister;