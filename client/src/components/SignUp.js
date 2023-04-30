import React, { useState } from 'react'
import AuthenticationHash from '../utils/AuthenticationHash';
import './SignUp.css';
import logo from '../Assets/logo.png';
const SignUp = ({ account, contract, provider }) => {
  const [name, setName] = useState("")
  
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [signedup, setSignedup] = useState(false)
   const onSignUp = async () => {
    //this.setState({ signedUp: false });
    
    // if (name !== '' && password !== '' && code !== '') {
    //   setName(name.trim());
    //   setPassword(password.trim());
    //   setCode(code.trim());


      //===
      // if (password.length < 8) {
      //     this.setState({
      //         alertMessage: "at least 8 characters for password",
      //         status: 'failed',
      //         password: '',
      //         digicode: '',
      //     });
      //return;
    //}
    if (code.length !== 6) {
      // this.setState({
      //     alertMessage: "6 digit required for digicode",
      //     status: 'failed',
      //     digicode: ''
      // });
      console.log("ok")
    //  window.alert("Your code length is less than 6")
      
        } else {
      try{
      let userAddress = await contract.getUserAddress()
      

      if (userAddress !== '0x0000000000000000000000000000000000000000') {
        // this.setState({
        //     alertMessage: 'this account already exists',
        //     status: 'failed',
        //     username: '',
        //     password: '',
        //     digicode: '',
        // });
window.alert("this account already exists")
        return;
      
      }
       else {
        let hash = await AuthenticationHash(name, account, password, code, provider);

        await contract.register(hash)

        // this.setState({
        //     username: '',
        //     password: '',
        //     digicode: '',
        //     status: 'success',
        //     alertMessage: "Signup successful",
        //     signedUp: true
        // });
        setCode('')
        setName('')
        setPassword('')
        window.alert("able to signup")
        // this.props.accountCreated(this.state.signedUp);
    
      }
    }catch(e){
      window.alert(`${e} `)
    }
    }
  }

const buttonClicked=(e)=>{
  e.preventDefault()
  onSignUp()

}

return (
  <div className='wrapper'>
      <div className='logo-img'>
          <img src={logo} className="Web-Logo" alt="logo" />
    </div>
    <form onSubmit={buttonClicked}>
    <h2>Sign Up</h2>
      <input type="text" placeholder='Your Name' value={name} onChange={(e) => { setName(e.target.value) }} ></input>
      <input type="password" placeholder='Your Password' value={password} onChange={(e) => { setPassword(e.target.value) }} ></input>
      <input type='number' placeholder='Your Code ' value={code} onChange={(e) => { setCode(e.target.value) }} ></input>
      {/* <input type="submit" value="Sign Up"/> */}
    </form>
    <input type="submit" value="Sign Up" className="btn btn-secondary btn-block login" />
  </div>
)


}
export default SignUp
