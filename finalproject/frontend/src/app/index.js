import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { NavBar } from '../components'
import { MemesList, MemesInsert, WYSIWYGEditor, DrawTemplate } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route path="/memes/list" exact component={MemesList} />
                <Route path="/memes/create-via-api" exact component={MemesInsert} />
                <Route path="/memes/create" exact>
                    <WYSIWYGEditor templateImagePath="/templates/_dummy.png" />
                </Route>
                <Route path="/memes/create-template" exact component={DrawTemplate} />
            </Switch>
        </Router>
    )
}

export default App