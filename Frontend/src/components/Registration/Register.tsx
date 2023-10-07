import { useState } from "react";
import axios from 'axios';

const AUTH_API_KEY = import.meta.env.VITE_AUTH_API_KEY;

function Register({ setAuthState, setNotification, setStatusNotification }:any) {

    document.title = "Register";
    document.querySelector("link[rel='icon']")?.setAttribute("href", "/lock.svg");

    const [username, setUsername] = useState<string>("");
    const [email, setGmail] = useState<string>("");
    const [password1, setPassword1] = useState<string>("");
    const [password2, setPassword2] = useState<string>("");
    const [showImage, setShowImage] = useState<boolean>(true);

    const notificationHandler = (message:string, status:string) => {
        setNotification(message);
        setStatusNotification(status);
        setTimeout(() => {
            setNotification("");
            setStatusNotification("");
        }
        , 2000);
    }

    const userHandler = (e:any) => {
        setUsername(e.target.value);
    }
    
    const gmailHandler = (e:any) => {
        setGmail(e.target.value);
    }

    const password1Handler = (e:any) => {
        setPassword1(e.target.value);
    }

    const password2Handler = (e:any) => {
        setPassword2(e.target.value);
    }

    const handleImage = () => {
        setShowImage(!showImage);
    }

    const handleSubmit = async (e:any) => {

        e.preventDefault();

        if(password1 !== password2){
            console.log("Password does not match");         
            notificationHandler("Password does not match", "error");
            return;
        }

        const data = {
            username: username,
            email: email,
            password: password1,
            AUTH_API_KEY: AUTH_API_KEY,
        }

        // send a post request using axios
        await axios.post('/register/sendMail', data)
        .then(() => {
            // console.log(res.data);
            setAuthState({
                showRegister: false,
                showLogin: false,
                showForgetPassword: false,
                showResetPassword: false,
                verifyRegister: true,
                verifyForgetPassword: false,
                showMainPage:false
            })
            notificationHandler("email sent successfully", "success");
        })
        .catch((err)=>{
            if (err.response) {
                notificationHandler("email not sent", "error");
            }
        })
        
    }

    const handleLogin = (e:any) => {
        e.preventDefault();
        setAuthState({
            showRegister: false,
            showLogin: true,
            showForgetPassword: false,
            showResetPassword: false,
            verifyRegister: false,
            verifyForgetPassword: false,
            showMainPage:false
        })
    }

    return (
        <div className="flex flex-col justify-center items-center w-320px h-screen gap-10 tracking-wide">
            <h1 className="text-indigo-600 font-medium text-lg">Create New Account</h1>
            <form className="flex flex-col items-center gap-5 w-full" onSubmit={handleSubmit}>
                <div className="relative">
                    <input type="text" id="username" name="username" className="border-solid border-2 border-indigo-600 p-2 pl-10" placeholder="Username" required onChange={(e)=>userHandler(e)} value={username}/>
                    <img src="/person.svg" alt="" className="absolute bottom-2 left-2" />
                </div>
                <div className="relative">
                    <input type="gmail" id="gmail" name="gmail" className="border-solid border-2 border-indigo-600 p-2 pl-10" placeholder="Gmail" required value={email} onChange={(e)=>gmailHandler(e)}/>
                    <img src="/gmail.svg" alt="" className="absolute bottom-2 left-2"/>
                </div>
                <div className="relative">
                    <input type={showImage ? 'text' : 'password'} id="password1" name="password" className="border-solid border-2 border-indigo-600 p-2 pl-10" placeholder="Password" value={password1} required onChange={(e)=>password1Handler(e)}/>
                    {showImage && <img src="/eye_open.svg" alt="" className="absolute bottom-2 left-2 opacity-100" onClick={handleImage}/> }
                    {!showImage && <img src="/eye_close.svg" alt="" className="absolute bottom-2 left-2 opacity-100" onClick={handleImage}/> }   
                </div>
                <input type={showImage ? 'text':'password'} id="password2" name="password" className="border-solid border-2 border-indigo-600 p-2 px-6" placeholder="confirm password" required value={password2} onChange={(e)=>password2Handler(e)}/>
                <button type="submit" className="bg-indigo-600 p-2 text-white font-medium">Register</button>
                <p className="text-indigo-600 font-medium cursor-pointer hover:border-b-2 border-indigo-600" onClick={(e)=>handleLogin(e)}>Login</p>
            </form>
        </div>
    )
}

export default Register;
