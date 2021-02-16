import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { NavBar } from '../components'
import { MemesList, SlideShow, MemesInsert, WYSIWYGEditor, DrawTemplate, UploadMeme } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route path="/" exact component={MemesList} />
                <Route path="/memes/list" exact component={MemesList} />
                <Route path="/memes/slideshow" exact component={SlideShow} />
                <Route path="/memes/create-via-api" exact component={MemesInsert} />
                <Route path="/memes/create" exact>
                    <WYSIWYGEditor templateImagePath="/templates/_dummy.png" />
                </Route>
                <Route path="/memes/create-template" exact component={DrawTemplate} />
                <Route path="/memes/uploadMeme" exact component={UploadMeme} />
            </Switch>
        </Router>
    )
}

export default App