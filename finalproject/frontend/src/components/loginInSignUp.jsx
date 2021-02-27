import React, { Component } from 'react';
import '../style/loginInSignUp.css';
import api from '../api'

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

    logIn = async () => {
        const { loginCred, loginPassword } = this.state
        const creds = { loginCred, loginPassword }

        await api.login(creds).then(res => {
            console.log(res)
            if (res.stauts == 401) {
                window.alert(`You entered wrong credentials`)
                this.setState({
                    loginCred: '',
                    loginPassword: '',
                    signupUsername: '',
                    signupEmail: '',
                    signupPassword: '',
                })
            }
            else {
                this.setState({
                    loginCred: '',
                    loginPassword: '',
                    signupUsername: '',
                    signupEmail: '',
                    signupPassword: '',
                })
                window.open("http://localhost:3000/memes","_self");
            }
        })
    }

    signUp = async () => {
        const { signupEmail, signupUsername, signupPassword } = this.state
        const creds = { signupEmail, signupUsername, signupPassword }

        await api.signup(creds).then(res => {
            if (res.stauts == 401) {
                window.alert(`You entered alredy registered credentials`)
                this.setState({
                    loginCred: '',
                    loginPassword: '',
                    signupUsername: '',
                    signupEmail: '',
                    signupPassword: '',
                })
            }
            else {
                this.setState({
                    loginCred: '',
                    loginPassword: '',
                    signupUsername: '',
                    signupEmail: '',
                    signupPassword: '',
                })
                window.open("http://localhost:3000/memes","_self");
            }
        })
    }
    
    activateRightPanel = () => {
        const container = document.getElementById('container');
        container.classList.add("right-panel-active");
    }

    deactivateRightPanel = () => {
        const container = document.getElementById('container');
        container.classList.remove("right-panel-active");
    }

    handleChangeInputLoginCred= async event => {
        const loginCred = event.target.value
        this.setState({ loginCred })
    }

    handleChangeInputLoginPassword= async event => {
        const loginPassword = event.target.value
        this.setState({ loginPassword })
    }

    handleChangeInputSignupUsername= async event => {
        const signupUsername = event.target.value
        this.setState({ signupUsername })
    }

    handleChangeInputSignupEmail= async event => {
        const signupEmail = event.target.value
        this.setState({ signupEmail })
    }

    handleChangeInputSignupPassword= async event => {
        const signupPassword = event.target.value
        this.setState({ signupPassword })
    }

    clearUsernamePlaceholder=  () => {
        const Usernameplaceholder = ''
        this.setState({ Usernameplaceholder })
    }

    render(){
        return (
            <div class="container" id="container">
                <div class="form-container sign-up-container">
                    <form action="#">
                        <h1>Create Account</h1>
                        <input required type="text" placeholder={this.state.Usernameplaceholder} onFocus={this.clearUsernamePlaceholder} onChange={this.handleChangeInputSignupUsername}/>
                        <input required type="email" placeholder="Email" onChange={this.handleChangeInputSignupEmail}/>
                        <input required type="password" placeholder="Password" onChange={this.handleChangeInputLoginPassword}/>
                        <button onClick={this.signUp}>Sign Up</button>
                    </form>
                </div>
                <div class="form-container sign-in-container">
                    <form action="#">
                        <h1>Sign in</h1>
                        <input required type="text" placeholder="Email or Username" onChange={this.handleChangeInputLoginCred}/>
                        <input required type="password" placeholder="Password" onChange={this.handleChangeInputLoginPassword}/>
                        <a href="#">Forgot your password?</a>
                        <button onClick={this.logIn}>Sign In</button>
                    </form>
                </div>
                <div class="overlay-container">
                    <div class="overlay">
                        <div class="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To be a meme master login with your personal info</p>
                            <button class="ghost" id="signIn" onClick={this.deactivateRightPanel}>Sign In</button>
                        </div>
                        <div class="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and enjoy the meme universe</p>
                            <button class="ghost" id="signUp" onClick={this.activateRightPanel}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default loginInSignUp