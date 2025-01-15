import  { useState } from 'react'
import LoginPage from "./signIn";
import SignUpPage from "./signUp";
const Next = () => {
    const[signUp,setSignUp]=useState(false);
  return (
    <div>
        {!signUp && <LoginPage setSignUp={setSignUp}/>}
        {signUp && <SignUpPage setSignUp={setSignUp}/>}
    </div>
  )
}

export default Next;