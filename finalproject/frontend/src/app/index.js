import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { NavBar } from '../components'
import { MemesList, MemesInsert, UploadMeme, Create, CreateCustom } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route path="/memes/list" exact component={MemesList} />
                <Route path="/memes/create" exact component={Create} />
                <Route path="/memes/create-custom" exact component={CreateCustom} />
                <Route path="/memes/create-api" exact component={MemesInsert} />
                <Route path="/memes/uploadMeme" exact component={UploadMeme} />
            </Switch>
        </Router>
    )
}

export default App