import React, { Component } from 'react';
import '../style/Login.scss';
import api from '../api';
import createTokenProvider from '../api/createTokenProvider';

class loginInSignUp extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loginCred: '',
            loginPassword: '',
            signupUsername: '',
            signupEmail: '',
            signupPassword: '',
            Usernameplaceholder: 'Username',
        }
    }

    /**
     * use credentials provided in form to log in
     * in any case clear input fields as well as state
     * login success: redirect to memes overview
     * login fail: user notification
     */
    logIn = async () => {
        const { loginCred, loginPassword } = this.state
        const creds = { loginCred, loginPassword }

        await api.login(creds).then(res => {
            if (res.status == 401) {
                window.alert(`You entered wrong credentials`)
                this.clearInput()
            }
            else {
                this.clearInput()
                createTokenProvider.setToken(res.data.token)
                window.open("http://localhost:3000/memes/view","_self");
            }
        })
    }

    /**
     * use credentials provided in form to sign uü
     * in any case clear input fields as well as state
     * success: redirect to memes overview
     * fail: user notification
     */
    signUp = async () => {
        const { signupEmail, signupUsername, signupPassword } = this.state
        const creds = { signupEmail, signupUsername, signupPassword }
        console.log(creds)

            await api.signup(creds).then(res => {
                if (res.status == 201) {
                    this.clearInput()
                    createTokenProvider.setToken(res.data.token)
                    window.open("http://localhost:3000/memes/view","_self");
                }
                else {
      
                    this.clearInput()
                    window.alert(`You entered already registered credentials`)
                }
            })
    }
    
    /**
     * reveal sign up screen
     */
    activateRightPanel = () => {
        const container = document.getElementById('login-page-wrapper');
        container.classList.add("right-panel-active");
    }

    /**
     * hide sign up screen
     */
    deactivateRightPanel = () => {
        const container = document.getElementById('login-page-wrapper');
        container.classList.remove("right-panel-active");
    }

    /**
     * update state with provided information
     * @param {Event} event 
     */
    handleChangeInputLoginCred= async event => {
        const loginCred = event.target.value
        this.setState({ loginCred })
    }

    /**
     * update state with provided information
     * @param {Event} event 
     */
    handleChangeInputLoginPassword= async event => {
        const loginPassword = event.target.value
        this.setState({ loginPassword })
    }

    /**
     * update state with provided information
     * @param {Event} event 
     */
    handleChangeInputSignupUsername= async event => {
        const signupUsername = event.target.value
        this.setState({ signupUsername })
    }

    /**
     * update state with provided information
     * @param {Event} event 
     */
    handleChangeInputSignupEmail= async event => {
        const signupEmail = event.target.value
        this.setState({ signupEmail })
    }

    /**
     * update state with provided information
     * @param {Event} event 
     */
    handleChangeInputSignupPassword= async event => {
        const signupPassword = event.target.value
        this.setState({ signupPassword })
    }

    /**
     * update state with provided information
     * @param {Event} event 
     */
    clearUsernamePlaceholder=  () => {
        const Usernameplaceholder = ''
        this.setState({ Usernameplaceholder })
    }

    /**
     * clear inputs fields as well as state
     */
    clearInput = () => {
        const inputField = document.getElementsByTagName("input")
        for (let i = 0; i < inputField.length; i ++){ 
            inputField[i].value = "";
        }
        this.setState({
            loginCred: '',
            loginPassword: '',
            signupUsername: '',
            signupEmail: '',
            signupPassword: '',
        })
    }

    render(){
        return (
            <div id="login-page-wrapper">
                <div className="form-container" id="sign-up-container">
                    <form action="#">
                        <h1>Create Account</h1>
                        <input required type="text" placeholder={this.state.Usernameplaceholder} onFocus={this.clearUsernamePlaceholder} onChange={this.handleChangeInputSignupUsername}/>
                        <input required type="email" placeholder="Email" onChange={this.handleChangeInputSignupEmail}/>
                        <input required type="password" placeholder="Password" onChange={this.handleChangeInputSignupPassword}/>
                        <button onClick={this.signUp}>Sign Up</button>
                    </form>
                </div>
                <div className="form-container" id="sign-in-container">
                    <form action="#">
                        {/* TODO ACTUALLY require email & username... */}
                        <h1>Sign in</h1>
                        <input required type="text" placeholder="Email or Username" onChange={this.handleChangeInputLoginCred}/>
                        <input required type="password" placeholder="Password" onChange={this.handleChangeInputLoginPassword}/>
                        <button onClick={this.logIn}>Sign In</button>
                    </form>
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel" id="overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To be a meme master login with your personal info</p>
                            <button id="signIn" onClick={this.deactivateRightPanel}>Sign In</button>
                        </div>
                        <div className="overlay-panel" id="overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and enjoy the meme universe</p>
                            <button id="signUp" onClick={this.activateRightPanel}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default loginInSignUp