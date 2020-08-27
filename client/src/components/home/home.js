import React, { Component } from 'react'
import {Card, Button, Modal} from "react-bootstrap"
import {getAllImages, getImage, deleteImage} from './ConnectServer'
import Gallery from 'react-grid-gallery';

class Home extends Component {

  constructor(){
    super()
    this.state = {
      images : [],
      photos_ids : [], 
      show : false,
      username : '',
      filename : '',
      currentImage: 0
    }
    this.onChange = this.onChange.bind(this)
    this.onCurrentImageChange = this.onCurrentImageChange.bind(this);
    this.onDeleteImage = this.onDeleteImage.bind(this);
  }



  componentDidMount() {
    if (!localStorage.usertoken)
      this.props.history.push(`/`)
    getAllImages().then(res => {
      this.setState({ photos_ids: res.image_ids })
      res.image_ids.map(id => {
        getImage(id).then(res=>{
          var img_detail = {
            src : res.uri,
            thumbnail : res.uri,
            id : res.id
          }
          console.log(res)
          this.setState({
            images: [...this.state.images, img_detail]
          })
        })
      })
    })
  }

  onCurrentImageChange(index) {
    this.setState({ currentImage: index });
  }

  onDeleteImage() {
    if (window.confirm(`Are you sure you want to delete image number ${this.state.currentImage}?`)) {
      var images = this.state.images.slice();
      deleteImage(images[this.state.currentImage].id).then(res => {
        images.splice(this.state.currentImage, 1)
        this.setState({
          images: images
        });
      })
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  shareImage(){
    console.log(this.state.username,this.state.filename)
  }
  
  render() {
    return (  
        <div className = "my-3">
        <Gallery
          images={this.state.images}
          enableLightbox={true}
          enableImageSelection={false}
          currentImageWillChange={this.onCurrentImageChange}

          customControls={[
            <button key="deleteImage" onClick={this.onDeleteImage}>Delete</button>
          ]}
        />
        </div>       
    )
  }
}


export default Home