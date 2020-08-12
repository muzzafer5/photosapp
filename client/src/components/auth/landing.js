import React, { Component } from 'react'
import {Nav,Navbar} from 'react-bootstrap'

class Landing extends Component {
  componentDidMount(){
    if(localStorage.usertoken)
        this.props.history.push(`/home`)  
  }
  render() {
    return (
        <div className = "landing">
            <div className = "header px-3" 
                style = {{
                    borderBottom : "1px solid #e6f7dc"
                }}
            >
                <Navbar collapseOnSelect expand="lg">
                <Navbar.Brand href="/">
                    <span
                        style = {{
                        color : "#6FA843",
                        fontSize : "20px",
                        fontWeight : "500"
                        }}
                    >
                        Photos
                    </span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto"></Nav>
                    <Nav>
                        <Nav.Link href="/auth/login">Login</Nav.Link>
                        <Nav.Link eventKey={2} href="/auth/signup">Signup</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                </Navbar>
            </div>
            <div className = "text-center my-5">
                <h1>We will keep your memories</h1>
            </div>
        </div>
    )
  }
}

export default Landing