import { useState } from 'react';
import axios from 'axios';

const AUTH_API_KEY = import.meta.env.VITE_AUTH_API_KEY;

function VerifyForgetPassword({ setAuthState, setNotification, setStatusNotification }:any) {

    document.title = "verify Forget Password"

    const notificationHandler = (message:string, status:string) => {
        setNotification(message);
        setStatusNotification(status);
        setTimeout(() => {
            setNotification("");
            setStatusNotification("");
        }, 2000);
    }

    const [email, setEmail] = useState<string>("");

    const emailHandler = (e:any) => {
        setEmail(e.target.value);
    }

    const handleSubmit = (event:any) => {
        event.preventDefault();
        setAuthState({
            showRegister: false,
            showLogin: false,
            showForgetPassword: false,
            showResetPassword: true,
            verifyRegister: false,
            verifyForgetPassword: false,
            showMainPage:false
        });

        const data = {
            email:email,
            AUTH_API_KEY:AUTH_API_KEY
        }

        axios.post("/reset/sendForgetMail",data)
        .then(() => {
            // console.log(res);
            notificationHandler("Forget Password Verificatoin Email Sent", "success")
        })
        .catch(() => {
            // console.log(err);
            notificationHandler("Forget Password Verificatoin Email Not Sent", "error")
        })
    }

    document.title = "Forget Password";
    return (
        <div className="flex flex-col justify-center items-center w-320px h-screen gap-10 tracking-wide">
            <h1 className="text-indigo-600 font-medium text-lg">Verify Email</h1>
            <form className="flex flex-col items-center gap-5 w-320px" onSubmit={handleSubmit}>
                <div className="relative">
                    <input type="email" id="username" name="username" className="border-solid border-2 border-indigo-600 p-2 pl-10" placeholder="Enter Gmail" required value={email} onChange={(e)=>emailHandler(e)}/>
                    <img src="/gmail.svg" alt="" className='absolute bottom-2 left-2'/>
                </div>
                <button type="submit" className="bg-indigo-600 w-full p-2 text-white font-medium" >Verify</button>
            </form>
        </div>
    )
}

export default VerifyForgetPassword;