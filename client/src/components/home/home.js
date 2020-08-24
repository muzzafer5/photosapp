import React, { Component } from 'react'
import {Card, Button, Modal} from "react-bootstrap"
import {getAllImages, getImage} from './ConnectServer'
import Gallery from 'react-grid-gallery';
// import { render } from 'react-dom';
class Home extends Component {

  constructor(){
    super()
    this.state = {
      photos : [],
      show : false,
      username : '',
      filename : '',
      images:[{
        src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
        thumbnail: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_n.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 174,
        isSelected: true,
        caption: "After Rain (Jeshu John - designerspics.com)"
},
{
        src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
        thumbnail: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_n.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 212,
        tags: [{value: "Ocean", title: "Ocean"}, {value: "People", title: "People"}],
        caption: "Boats (Jeshu John - designerspics.com)"
},

{
        src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
        thumbnail: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_n.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 212
}]
,
    }
    this.onChange = this.onChange.bind(this)
  }

  componentDidMount() {
    if(!localStorage.usertoken)
      this.props.history.push(`/`)
    console.log(this.props.location.pathname)
    getAllImages().then(res=>{
      this.setState({photos : res})
      console.log(res)
      return this.state.photos  
    })
    .then((photos)=>{
      for (var photo_id=0; photo_id<photos.length; photo_id++){
        getImage(photos[photo_id]).then((image)=>{
          console.log(image)
          image = {src:image.uri,
            thumbnail: image.uri,
            thumbnailWidth: 200,
            thumbnailHeight: 200,
            tags:[{value:"aaa", title:"aba"}],
            caption:image.name,
            isSelected: false
          }
          let image_arr = this.state.images
          image_arr.push(image)
          console.log(image)
          this.setState({images: image_arr})
        })
      }
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
          <Gallery images={this.state.images}/>
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
                      }}>
                      {/* <img height = "150px" src = {require('../../../public/uploads/'+data.image.filename)} alt = "pic" /> */}
                      {/* <div>Image name</div> */}
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