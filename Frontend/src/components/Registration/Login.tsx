import { useEffect, useState } from "react";
import axios from "axios";

// access the environment variables from .env
const AUTH_API_KEY = import.meta.env.VITE_AUTH_API_KEY;

function Login ({ setAuthState, setNotification, setStatusNotification }:any) {

    document.title = "Login"

    const notificationHandler = (message:string, status:string) => {
        setNotification(message);
        setStatusNotification(status);
        setTimeout(() => {
            setNotification("");
            setStatusNotification("");
        }, 2000);
    }

    const [showImage, setShowImage] = useState<boolean>(true);

    const handleImage = () => {
        setShowImage(!showImage);
    }

    // The below useEffect is used to check if the user is already logged in
    useEffect(()=>{

        const allCookies = document.cookie;

        // check if the cookies are present
        if(allCookies) {
            
            const cookieArray = allCookies.split('; ')

            let token = null;

            for (const cookie of cookieArray) {
                const [name, value] = cookie.split('=');
                if(name === 'token') {
                    token = value;
                    break;
                }
            }

            const data = {
                token:token,
                AUTH_API_KEY:AUTH_API_KEY
            }

            axios.post("/users/autosignin",data)
            .then(()=>{
                // console.log(res)
                setAuthState({
                    showRegister: false,
                    showLogin: false,
                    showForgetPassword: false,
                    showResetPassword: false,
                    verifyRegister: false,
                    verifyForgetPassword: false,
                    showMainPage:true
                })
                notificationHandler("You are already logged in","success")
            }).catch(()=>{
                notificationHandler("Please Login Again","error")
                // console.log(err)
            })
        }
    },[])

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [checked, setChecked] = useState(false);

    const handleEmail = (e:any) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e:any) => {
        setPassword(e.target.value);
    }

    const handleCheck = (e:any) => {
        setChecked(e.target.checked);
    }

    const handleSubmit = (e:any) => {
        e.preventDefault();

        const data = {
            email: email,
            password: password,
            AUTH_API_KEY:AUTH_API_KEY,
            checked:checked
        }

        axios.post("/users/signin",data)
        .then(() => {
            // console.log(res)
            setAuthState({
                showRegister: false,
                showLogin: false,
                showForgetPassword: false,
                showResetPassword: false,
                verifyRegister: false,
                verifyForgetPassword: false,
                showMainPage:true
            })
            notificationHandler("Login Successfull","success")
        }).catch(() => {
            notificationHandler("Please Login Again","error")
            // console.log(err)
        })
    }

    const handleRegister = (e:any) => {
        e.preventDefault();
        setAuthState({
            showRegister: true,
            showLogin: false,
            showForgetPassword: false,
            showResetPassword: false,
            verifyRegister: false,
            verifyForgetPassword: false,
            showMainPage:false
        })
    }

    const handleForget = (e:any) => {
        e.preventDefault();
        setAuthState({
            showRegister: false,
            showLogin: false,
            showForgetPassword: true,
            showResetPassword: false,
            verifyRegister: false,
            verifyForgetPassword: false,
            showMainPage:false
        })
    }

    return (
        <div className="flex flex-col justify-center items-center w-320px h-screen gap-10 tracking-wide">
            <h1 className="text-indigo-600 font-medium text-lg">Login Page</h1>
            <form className="flex flex-col items-center gap-5 w-320px" onSubmit={handleSubmit}>
            <div className="flex gap-4 flex-col">
                <div className="relative">
                    <input type="gmail" id="gmail" name="gmail" className="border-solid border-2 border-indigo-600 p-2 pl-10" placeholder="Gmail" required value={email} onChange={(e)=>handleEmail(e)}/>
                    <img src="/gmail.svg" alt="" className="absolute bottom-2 left-2"/>
                </div>
                <div className="relative">
                    <input type="password" id="loginpassword" name="password" className="border-solid border-2 border-indigo-600 p-2 pl-10" placeholder="Password" required onChange={handlePassword}/>
                    {showImage && <img src="/eye_open.svg" alt="" className="absolute bottom-2 left-2" onClick={handleImage}/> }
                    {!showImage && <img src="/eye_close.svg" alt="" className="absolute bottom-2 left-2" onClick={handleImage}/> }   
                </div>
                </div>
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="terms" name="terms" className="border-solid border-2 border-indigo-600 p-2" onClick={(e)=>handleCheck(e)}/>
                    <label htmlFor="terms" className="text-indigo-600 font-medium" >Remember me</label>
                </div>
                <button type="submit" className="bg-indigo-600 w-full p-2 text-white font-medium">Login</button>
                <p className="text-indigo-600 font-medium cursor-pointer hover:border-b-2 border-indigo-600" onClick={(e)=>handleRegister(e)} >Register Account</p>
                <p className="text-indigo-600 font-medium cursor-pointer hover:border-b-2 border-indigo-600" onClick={(e)=>handleForget(e)}>Forget Password ?</p>
            </form>
        </div>
    )
}

export default Login;