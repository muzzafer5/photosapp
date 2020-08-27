import React, { Component } from 'react'
import {Nav,Navbar,Modal,Button} from 'react-bootstrap'
import {upload, getAllTags, createTag,getTag} from './ConnectServer'
import {call_logout} from '../auth/ConnectServer'
import Select, { components } from 'react-select';

class Header extends Component {

  constructor(props){
    super(props)
    this.state = {
      show_upload_modal : false,
      show_tag_modal: false,
      errors : {},
      image_name : '',
      image_tags : [0,1],
      uri : '',
      tag : '',
      tags : [],
      place : ''
    }
    this.onChange = this.onChange.bind(this)
    this.logOut = this.logOut.bind(this)
  }

  toggleUploadModal(){
    this.setState({ show_upload_modal: !this.state.show_upload_modal})
  }
  
  toggleTagModal(){
    this.setState({show_tag_modal : !this.state.show_tag_modal, tag : ''})
  }

  onChange(e){
    this.setState({[e.target.name] : e.target.value})
  }

  onImgUpload(e){
    var details = {
      name : this.state.image_name,
      uri : this.state.uri,
      place : this.state.place,
      tags : this.state.image_tags
    }
    console.log(details)
    upload(details).then(res=>{
      console.log(res)
      //window.location.reload()
    })
    this.setState({show_upload_modal : false})
  }

  onCreateTag(){
    var details = {
      name : this.state.tag
    }
    createTag(details).then(res=>{
      var newTag = {
        label : details.name,
        value : details.name
      }
      this.setState({ tags: [...this.state.tags, newTag] })
    })
    this.toggleTagModal()
  }

  componentDidMount(){
    getAllTags().then(res=>{
      if(res){
        res.tag_ids.map(data=>{
          getTag(data).then(res=>{
            var newTag = {
              label: res.name,
              value: res.value
            }
            this.setState({tags : [...this.state.tags, newTag]})
          })
        })
      }
    })
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
                  <div className="form-group my-3 mx-3">
                    <label htmlFor="tag">Tag</label><br/>
                    <Select 
                      isMulti
                      name="image_tags"
                      options={this.state.tags} 
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
    const tagModal = (
      <Modal centered show={this.state.show_tag_modal} animation={false}>
        <Modal.Header closeButton onClick={() => this.toggleTagModal()}>
          <Modal.Title>Create a tag</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <div className="form-group my-3 mx-3">
            <input
              type="text"
              className="form-control"
              name="tag"
              required
              placeholder="Enter the tag"
              value={this.state.tag}
              onChange={this.onChange}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" className="btn btn-primary" onClick={() => this.onCreateTag()}>
            Create
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
                <Nav.Link eventKey={2} onClick={() => this.toggleTagModal()}>Create tag</Nav.Link>                 
                <Nav.Link eventKey={3} onClick={this.logOut} className = "ml-3">Logout</Nav.Link>
              </Nav>
          </Navbar.Collapse>
          {UploadModal}
          {tagModal}
        </Navbar>
    )
  }
}

export default Header