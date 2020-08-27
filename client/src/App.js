import React, { PureComponent } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import {ProtectedRoute} from "./route"

import Home from './components/home/home'
import Landing from './components/auth/landing'
import Login from './components/auth/login'
import Signup from './components/auth/signup'
import Album from './components/home/album'
import Shared from './components/home/shared'
import MyPhotos from './components/home/private'
import AlbumPhotos from './components/home/album_photos'

class App extends PureComponent {
  render () {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={Landing} />
          <Route exact path = "/auth/login" component = {Login} />
          <Route exact path = "/auth/signup" component = {Signup} />
          <ProtectedRoute exact path="/home" component={Home} />
          <ProtectedRoute exact path="/shared" component={Shared} />
          <ProtectedRoute exact path="/album" component={Album} />
          <ProtectedRoute exact path="/myphotos" component={MyPhotos} />
          <ProtectedRoute exact path="/album/:albumId" component={AlbumPhotos} />
        </div>
      </Router>
    )
  }
}
export default App;

