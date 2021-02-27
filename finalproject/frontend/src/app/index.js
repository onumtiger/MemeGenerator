import React from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { NavBar, loginInSignUp } from '../components'
import { CreateAPI, Create, CreateCustom, View, MyMemes } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route path="/" exact>
                    <Redirect to="/login" />
                </Route>
                <Route path="/login" exact component={loginInSignUp}/>
                <Route path="/memes/view" component={View} />
                <Route path="/memes/own" component={MyMemes} />
                <Route path="/memes/create" exact component={Create} />
                <Route path="/memes/create/custom" exact component={CreateCustom} />
                <Route path="/memes/create/api" exact component={CreateAPI} />
            </Switch>
        </Router>
    )
}

export default App