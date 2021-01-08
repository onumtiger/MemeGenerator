import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { NavBar } from '../components'
import { MemesList, MemesInsert } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route path="/memes/list" exact component={MemesList} />
                <Route path="/memes/create" exact component={MemesInsert} />
            </Switch>
        </Router>
    )
}

export default App