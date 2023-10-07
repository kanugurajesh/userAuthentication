import { useState } from "react";
import axios from 'axios';

// access the environment variables from .env
const AUTH_API_KEY = import.meta.env.VITE_AUTH_API_KEY;

// The below function is used to verify the gmail
function ForgetPassword({ setAuthState, setNotification, setStatusNotification }:any) {

    document.title = "Forget Passoword"

    // The below function is used to handle the notification
    const notificationHandler = (message:string, status:string) => {
        // set the notification
        setNotification(message);
        setStatusNotification(status);
        // set the notification to empty after 2 seconds
        setTimeout(() => {
            setNotification("");
            setStatusNotification("");
        }, 2000);
    }

    // The below hooks are used to store the values
    const [code, setCode] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [password1, setPassword1] = useState<string>("");
    const [showImage, setShowImage] = useState<boolean>(true);

    // The below functions are used to handle the values
    const codeHandler = (e:any) => {
        setCode(e.target.value);
    }

    const handleImage = () => {
        setShowImage(!showImage);
    }
    const passwordHandler = (e:any) => {
        setPassword(e.target.value);
    }

    const passwordHandler1 = (e:any) => {
        setPassword1(e.target.value);
    }

    // The below function is used to handle the submit
    const handleSubmit = (e:any) => {
        // prevent the default behaviour (refreshing the page)
        e.preventDefault();

        // check if the password and confirm password are same
        if (password1 !== password) {
            // call the notification handler with error message and error
            notificationHandler("Password doesn't match", "error");
            // exit the function execution
            return;
        }

        // The below data is used to send the request to the backend
        const data = {
            AUTH_API_KEY: AUTH_API_KEY,
            PASSWORD: password,
            AUTH_PASSWORD: code
        }

        // The below axios is used to send the request to the backend
        axios.post("/reset/verifyForgetMail", data)
        .then(() => {
            // console.log(res)            
            setAuthState({
                showRegister: false,
                showLogin: true,
                showForgetPassword: false,
                showResetPassword: false,
                verifyRegister: false,
                verifyForgetPassword: false,
                showMainPage:false
            })
            // call the notification handler with success message and success
            notificationHandler("Password reset Successfull", "success")
        }).catch(() => {
            // console.log(err)
            notificationHandler("Password reset Unsuccessful", "error")
        })
    }

    return (
        <div className="flex flex-col justify-center items-center w-320px h-screen gap-10 tracking-wide">
            <h1 className="text-indigo-600 font-medium text-lg">Verify the gmail</h1>
            <form className="flex flex-col items-center gap-5 w-320px" onSubmit={handleSubmit}>
                <div className="relative">
                    <input type="text" id="forgetcode" name="email" className="border-solid border-2 border-indigo-600 p-2 pl-10" placeholder="Enter Verification Code" value={code} onChange={(e)=>codeHandler(e)} required/>
                    <img src="/gmail.svg" className="absolute bottom-2 left-2" alt="" />
                </div>
                <div className="relative">
                    <input type={showImage?'text':'password'} id="resetpassword" name="password" className="border-solid border-2 border-indigo-600 p-2 pl-10" placeholder="password" value={password} required onChange={(e)=>passwordHandler(e)}/>
                    {showImage && <img src="/eye_open.svg" alt="" className="absolute bottom-2 left-2 opacity-100" onClick={handleImage}/> }
                    {!showImage && <img src="/eye_close.svg" alt="" className="absolute bottom-2 left-2 opacity-100" onClick={handleImage}/> } 
                </div>
                <input type={showImage?'text':'password'} id="resetpassword1" name="password" className="border-solid border-2 border-indigo-600 p-2 px-6" placeholder="confirm password" value={password1} required onChange={(e)=>passwordHandler1(e)}/>
                {/* <input type="password" id="resetpassword" name="password" className="border-solid border-2 border-indigo-600 p-2" placeholder="password" value={password} required onChange={passwordHandler}/> */}
                {/* <input type="password" id="resetpassword1" name="password" className="border-solid border-2 border-indigo-600 p-2" placeholder="confirm password" value={password1} required onChange={passwordHandler1}/> */}
                <button type="submit" className="bg-indigo-600 w-full p-2 text-white font-medium">Change Password</button>
            </form>
        </div>
    )
}

export default ForgetPassword;