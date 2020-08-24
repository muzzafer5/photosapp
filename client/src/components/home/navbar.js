import React, { Component } from 'react'
import {Nav,Navbar,Modal,Button} from 'react-bootstrap'
import {upload, getAllTags} from './ConnectServer'
import axios from 'axios'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
// import { Link } from 'react-router-dom'
import Select, { components } from 'react-select';
// import makeAnimated from 'react-select/lib/animated';  
// import makeAnimated from 'react-select/lib/animated';
class Header extends Component {

  constructor(props){
    super(props)
    this.state = {
      show_upload_modal : false,
      selected_file : null,
      errors : {},
      tags: [{value:1,label:"aa"},{value:2,label:"aaa"}],
      tag_selected:[],
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
  // componentDidMount() {
  //   if(!localStorage.usertoken)
  //     this.props.history.push(`/`)
  //   // console.log(this.props.location.pathname)
  //   getAllTags().then(res=>{ 
  //     this.setState({tags : res})
  //     console.log(res)
  //     return this.state.photos  
  //   })
  //   .then((photos)=>{
  //     for (var photo_id=0; photo_id<photos.length; photo_id++){
  //       getImage(photos[photo_id]).then((image)=>{
  //         console.log(image)
  //         image = {src:image.uri,
  //           thumbnail: image.uri,
  //           thumbnailWidth: 200,
  //           thumbnailHeight: 200,
  //           tags:[{value:"aaa", title:"aba"}],
  //           caption:image.name,
  //           isSelected: false
  //         }
  //         let image_arr = this.state.images
  //         image_arr.push(image)
  //         console.log(image)
  //         this.setState({images: image_arr})
  //       })
  //     }
  //   })
  // }
  

  logOut(e) {
    e.preventDefault();
    let axiosConfig = {
      headers: {
          'Content-Type': 'application/json',
          'AUTHORIZATION':  localStorage.usertoken
      }
    }
    // this.props.history.push('/auth/login')
    axios.post('http://localhost:8080/api/v1/accounts/logout/', {}, axiosConfig).then(
      response => {
        if (response.status==204){
          localStorage.removeItem("usertoken")
          this.props.history.push('/auth/login')
        }
      }
    ).catch(e => {
      console.log(e)
      alert(e)
    })
    // this.props.history.push('/auth/login')
  }

  render(){
    const UploadModal=(
              <Modal centered show ={this.state.show_upload_modal} animation={false}>
                <Modal.Header closeButton onClick = {()=>this.CloseUploadModal()}>
                <Modal.Title>Upload photo</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    {/* <div className="form-group my-3 mx-3">
                        <input></input>
                        <input
                          type="file" 
                          id="img" 
                          name="img" 
                          accept="image/*"
                          onChange={this.onFileChange}
                        />
                    </div>   */}
                    {/* <form validate="true" onSubmit={this.onSubmit}> */}
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
                <label htmlFor="tags">Tags</label>
                <Select
                  className="mt-4 col-md-6 col-offset-4"
                  value={this.state.tag_selected}
                  // components={makeAnimated()}
                  isMulti
                  options={this.state.tags}
                />
              </div>
              

              {/* <div className = "mb-3">
                <button
                  type="submit"
                  className="btn btn-primary mx-3 px-5"
                  onSubmit={this.onSubmit}
                >
                  Upload
                </button>
              </div> */}
            {/* </form> */}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="dark" className="btn btn-primary" onClick={()=>this.onFileUpload()}>
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