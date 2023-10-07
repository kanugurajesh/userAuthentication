import { useState } from "react";
import Register from "./Register";
import Login from "./Login";
import ForgetPassword from "./ForgetPassword";
import VerifyRegister from "./VerifyRegister";
import VerifyForgetPassword from "./VerifyForgetPassword";
import Main from '../Main/Main';

// notificationHandler is a function that takes in two parameters: message and load (success or error)  

const UserAuth = ( { setNotification, setStatusNotification }:any ) => {

  document.title = "User Authentication";
  document.querySelector("link[rel='icon']")?.setAttribute("href", "lock.svg");

  const [authState, setAuthState] = useState({
    showRegister: true,
    showLogin: false,
    showForgetPassword: false,
    showResetPassword: false,
    verifyRegister: false,
    verifyForgetPassword: false,
    showMainPage:false
  });

  return (
    <div>
        {authState.showRegister && <Register setAuthState={setAuthState}  setNotification={setNotification} setStatusNotification={setStatusNotification}/>}
        {authState.showLogin && <Login  setAuthState={setAuthState} setNotification={setNotification} setStatusNotification={setStatusNotification}/>}
        {authState.showForgetPassword && <VerifyForgetPassword  setAuthState={setAuthState} setNotification={setNotification} setStatusNotification={setStatusNotification}/>}
        {authState.showResetPassword && <ForgetPassword  setAuthState={setAuthState} setNotification={setNotification} setStatusNotification={setStatusNotification}/>}
        {authState.verifyRegister && <VerifyRegister  setAuthState={setAuthState} setNotification={setNotification} setStatusNotification={setStatusNotification}/>}
        {authState.verifyForgetPassword && <VerifyForgetPassword  setAuthState={setAuthState} setNotification={setNotification} setStatusNotification={setStatusNotification}/>}
        {authState.showMainPage && <Main />}
    </div>
  )
};

export default UserAuth;