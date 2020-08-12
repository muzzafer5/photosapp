import React, { Component } from 'react'
import {Card,Button,Modal} from "react-bootstrap"
import {fetch} from './ConnectServer'
class Home extends Component {

  constructor(){
    super()
    this.state = {
      photos : [],
      show : false,
      username : '',
      filename : ''
    }
    this.onChange = this.onChange.bind(this)
  }

  componentDidMount() {
    if(!localStorage.usertoken)
      this.props.history.push(`/`)
    console.log(this.props.location.pathname)
    fetch().then(res=>{
      this.setState({photos : res})
      console.log(res)
    }) 
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  OpenModal (filename){
    this.setState({filename : filename})
    this.setState({show : true})
  }

  CloseModal (){
    this.setState({show : false})
  }

  shareImage(){
    console.log(this.state.username,this.state.filename)
  }
  
  render() {
    const modal = (
      <Modal show ={this.state.show} onHide = {()=>this.CloseModal()} animation={false}  size ="lg">
        <Modal.Header closeButton >
        <Modal.Title id="example-custom-modal-styling-title">Image name</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <div className="center"><img  height = "400px" src = {this.state.filename} alt = "pic" /></div>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="light" type = "submit" className="main-btn " onClick = {()=>this.shareImage()}>
          <input                   
            type="text"
            name="username"
            placeholder="Enter username"
            required
            value = {this.state.username}
            onChange={this.onChange}
            style={{marginRight : "5px"}}>
          </input>
            Share
        </Button>
        <Button variant="light" className="main-btn ">
            Delete
        </Button>
        <Button variant="light" className="main-btn ">
            Add to Album
        </Button>
        </Modal.Footer>
    </Modal>
    )
    return (  
        <div className = "my-3">
          {
            this.state.photos?
              (
                this.state.photos.map((data,index) =>(
                  <span key = {index}>
                    <Button variant="outline-light" onClick = {()=>this.OpenModal(require('../../../public/uploads/'+data.image.filename))}
                        style = {{
                          backgroundColor : "white",
                          color : "black",
                          margin : "3px",
                          border : '1px solid #effce8'
                      }}
                    >
                      <img height = "150px"src = {require('../../../public/uploads/'+data.image.filename)} alt = "pic" />
                      <div>Image name</div>
                    </Button>
                  </span>
                ))
              ):''
          }
          {modal}
        </div>
        
    )
  }
}


export default Home