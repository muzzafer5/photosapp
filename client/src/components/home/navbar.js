import React, { Component } from 'react'
import {Nav,Navbar,Modal,Button} from 'react-bootstrap'
import {upload, getAllTags} from './ConnectServer'
import {call_logout} from '../auth/ConnectServer'
import axios from 'axios'

import Select, { components } from 'react-select';

class Header extends Component {

  constructor(props){
    super(props)
    this.state = {
      show_upload_modal : false,
      errors : {},
      image_name : '',
      uri : '',
      place : '',
      tags: [{value:1,label:"aa"},{value:2,label:"aaa"}],
      tag_selected:[],
    }
    this.onChange = this.onChange.bind(this)
    this.logOut = this.logOut.bind(this)
  }

  toggleUploadModal(){
    this.setState({ show_upload_modal: !this.state.show_upload_modal})
  }
  
  onChange(e){
    this.setState({[e.target.name] : e.target.value})
  }

  onImgUpload(e){
    var details = {
      name : this.state.image_name,
      uri : this.state.uri,
      place : this.state.place
    }
    upload(details).then(res=>{
      console.log(res)
      window.location.reload()
    })
    console.log(details);
    this.setState({show_upload_modal : false})
  }

  logOut(e) {
    e.preventDefault();
    call_logout().then(response => {
          localStorage.removeItem("usertoken")
          this.props.history.push('/auth/login')
      }
    )
  }

  render(){
    const UploadModal=(
              <Modal centered show ={this.state.show_upload_modal} animation={false}>
                <Modal.Header closeButton onClick = {()=>this.toggleUploadModal()}>
                <Modal.Title>Upload photo</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                  <div className="form-group my-3 mx-3">
                    <label htmlFor="image_name">Image name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="image_name"
                      required
                      placeholder="Enter the Image name"
                      value={this.state.image_name}
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="form-group my-3 mx-3">
                    <label htmlFor="uri">URI</label>
                    <input
                      type="uri"
                      className="form-control"
                      name="uri"
                      placeholder="http://"
                      required
                      value={this.state.uri}
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="form-group my-3 mx-3">
                    <label htmlFor="name">Place</label>
                    <input
                      type="text"
                      className="form-control"
                      name="place"
                      required
                      placeholder="Enter the place"
                      value={this.state.place}
                      onChange={this.onChange}
                    />
                  </div>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="dark" className="btn btn-primary" onClick={()=>this.onImgUpload()}>
                    Upload
                </Button>
                </Modal.Footer>
            </Modal>
    )
    return (
        <Navbar className ="px-3" collapseOnSelect expand="lg" 
          style = {{
            borderBottom : "1px solid #e6f7dc",
          }}
        >
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
                <Nav.Link eventKey={1} onClick = {()=>this.toggleUploadModal()}>Upload</Nav.Link>                 
                <Nav.Link eventKey={2} onClick={this.logOut} className = "ml-3">Logout</Nav.Link>
              </Nav>
          </Navbar.Collapse>
          {UploadModal}
        </Navbar>
    )
  }
}

export default Header