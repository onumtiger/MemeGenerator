import React from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { NavBar } from '../components'
import { MemesInsert, Create, CreateCustom, View } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route path="/" exact>
                    <Redirect to="/memes/view" />
                </Route>
                <Route path="/memes/view" component={View} />
                <Route path="/memes/create" exact component={Create} />
                <Route path="/memes/create-custom" exact component={CreateCustom} />
                <Route path="/memes/create-api" exact component={MemesInsert} />
            </Switch>
        </Router>
    )
}

export default App