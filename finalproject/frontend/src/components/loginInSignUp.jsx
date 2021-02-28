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
    logIn = async (e) => {
        e.preventDefault();
        const { loginCred, loginPassword } = this.state;
        const creds = { loginCred, loginPassword };

        if(!loginCred || !loginPassword){
            this.clearLoginInput();
            return;
        }

        await api.login(creds).then(res => {
            if (res.status = 200) {
                createTokenProvider.setToken(res.data.token);
                this.props.history.push('/memes/view/');
            }
            this.clearLoginInput();
        }).catch(()=>{
            window.alert(`You entered wrong credentials`);
        });
    }

    /**
     * use credentials provided in form to sign uü
     * in any case clear input fields as well as state
     * success: redirect to memes overview
     * fail: user notification
     */
    signUp = async (e) => {
        e.preventDefault();
        const { signupEmail, signupUsername, signupPassword } = this.state;
        const creds = { signupEmail, signupUsername, signupPassword };

        if(!signupEmail || !signupUsername || !signupPassword){
            this.clearSignupInput();
            return;
        }

        await api.signup(creds).then(res => {
            if (res.status == 201) {
                createTokenProvider.setToken(res.data.token);
                this.props.history.push('/memes/view/');
            }
            this.clearSignupInput();
        }).catch(()=>{
            window.alert(`You entered invalid or already registered credentials!`);
        });
    }

    useWithoutLogin = () => {
        this.props.history.push('/memes/view/');
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
     * clear inputs fields as well as state for login
     */
    clearLoginInput = () => {
        const inputFields = document.querySelectorAll("#sign-in-container input");
        for (let i = 0; i < inputFields.length; i ++){ 
            inputFields[i].value = "";
        }
        this.setState({
            loginCred: '',
            loginPassword: '',
        })
    }

    /**
     * clear inputs fields as well as state for signup
     */
    clearSignupInput = () => {
        const inputFields = document.querySelectorAll("#sign-up-container input");
        for (let i = 0; i < inputFields.length; i ++){ 
            inputFields[i].value = "";
        }
        this.setState({
            signupUsername: '',
            signupEmail: '',
            signupPassword: '',
        })
    }

    render(){
        if(createTokenProvider.isLoggedIn()){
            this.props.history.push('/memes/view/');
            return null;
        }
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
                        <h1>Sign in</h1>
                        <input required type="text" placeholder="Email or Username" onChange={this.handleChangeInputLoginCred}/>
                        <input required type="password" placeholder="Password" onChange={this.handleChangeInputLoginPassword}/>
                        <button onClick={this.logIn}>Sign In</button>
                    </form>
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel" id="overlay-left">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and enjoy the meme universe</p>
                            <button id="signIn" onClick={this.deactivateRightPanel}>Sign In Instead</button>
                            <button className="nologin" onClick={this.useWithoutLogin}>Continue Without an Account</button>
                        </div>
                        <div className="overlay-panel" id="overlay-right">
                            <h1>Welcome Back!</h1>
                            <p>To be a meme master login with your personal info</p>
                            <button id="signUp" onClick={this.activateRightPanel}>Sign Up Instead</button>
                            <button className="nologin" onClick={this.useWithoutLogin}>Continue Without an Account</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default loginInSignUp