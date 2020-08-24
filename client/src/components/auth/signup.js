import React, { Component } from 'react'
import { signup } from './ConnectServer'
import { Link } from 'react-router-dom'

class Signup extends Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: '',
      errors: {}
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  onSubmit(e) {
    e.preventDefault()
    const newUser = {
      username: this.state.username,
      password: this.state.password,
    }
    signup(newUser).then(res => {
      if(res){
        this.props.history.push(`/auth/login`)
      }
    })
  }
   
  render() {
    return (
      <div className="signup " 
        style = {{
            border : "2px solid grey",
            position:"absolute",
            top : "25%", 
            width: "35%", 
            left : "30%", 
            borderRadius : "20px"
          }}>
            <form validate="true" onSubmit={this.onSubmit}>
              <h1 className="h2 text-center py-2" style = {{borderBottom : "1px solid grey"}}>Signup</h1>
              <div className="form-group my-3 mx-3">
                <label htmlFor="name">User name</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  required
                  placeholder="Enter the User name"
                  value={this.state.username}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group my-3 mx-3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  required
                  value={this.state.password}
                  onChange={this.onChange}
                />
              </div>
              <div className = "mb-3">
                <button
                  type="submit"
                  className="btn btn-primary mx-3 px-5"
                >
                  Signup
                </button>
                <Link to={'/auth/login'} >Already have an account?</Link>
              </div>
            </form>
      </div>
    )
  }
}

export default Signup
