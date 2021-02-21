import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { NavBar } from '../components'
import { MemesList, SlideShow, MemesInsert, Create, CreateCustom } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route path="/" exact component={MemesList} />
                <Route path="/memes/slideshow" exact component={SlideShow} />
                <Route path="/memes/create" exact component={Create} />
                <Route path="/memes/create-custom" exact component={CreateCustom} />
                <Route path="/memes/create-api" exact component={MemesInsert} />
            </Switch>
        </Router>
    )
}

export default App