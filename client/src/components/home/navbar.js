import React, { Component } from 'react'
import {Nav,Navbar,Modal,Button} from 'react-bootstrap'
import {upload} from './ConnectServer'

class Header extends Component {

  constructor(props){
    super(props)
    this.state = {
      show_upload_modal : false,
      selected_file : null,
      errors : {}
    }
    this.logOut = this.logOut.bind(this)
    this.onFileChange = this.onFileChange.bind(this)
  }

  OpenUploadModal(){
    this.setState({show_upload_modal : true})
  }

  CloseUploadModal(){
    this.setState({show_upload_modal : false})
  }

  onFileChange(e){
    this.setState({ selected_file: e.target.files[0] });
  }

  onFileUpload(){
    const formData = new FormData();
    formData.append('myfile',this.state.selected_file);
    upload(formData).then(res=>{})
    this.setState({show_upload_modal : false})
    this.setState({ selected_file: null})
  }

  logOut(e) {
    e.preventDefault();
    localStorage.removeItem("usertoken")
    this.props.history.push('/auth/login')
  }

  render(){
    const UploadModal=(
              <Modal centered show ={this.state.show_upload_modal} animation={false}>
                <Modal.Header closeButton onClick = {()=>this.CloseUploadModal()}>
                <Modal.Title>Upload photo</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <div className="form-group my-3 mx-3">
                        <input
                          type="file" 
                          id="img" 
                          name="img" 
                          accept="image/*"
                          onChange={this.onFileChange}
                        />
                    </div>  
                </Modal.Body>
                <Modal.Footer>
                <Button variant="light" className="main-btn " onClick={()=>this.onFileUpload()}>
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
                <Nav.Link eventKey={1} onClick = {()=>this.OpenUploadModal()}>Upload</Nav.Link>                 
                <Nav.Link eventKey={2} onClick={this.logOut} className = "ml-3">Logout</Nav.Link>
              </Nav>
          </Navbar.Collapse>
          {UploadModal}
        </Navbar>
    )
  }
}

export default Header