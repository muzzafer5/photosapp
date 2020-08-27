import React, { Component } from 'react'
import {Card, Button, Modal} from "react-bootstrap"
import {getAllImages, getImage, deleteImage, shareImage} from './ConnectServer'
import Gallery from 'react-grid-gallery';

class Home extends Component {

  constructor(){
    super()
    this.state = {
      images : [],
      users_ids : '',
      currentImage: 0
    }
    this.onChange = this.onChange.bind(this)
    this.onCurrentImageChange = this.onCurrentImageChange.bind(this)
    this.onDeleteImage = this.onDeleteImage.bind(this)
    this.onShareImage = this.onShareImage.bind(this)
  }

  componentDidMount() {
    if (!localStorage.usertoken)
      this.props.history.push(`/`)
    getAllImages().then(res => {
      if(res){
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
      }
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

  onShareImage(){
    var images = this.state.images.slice();
    var users_ids = this.state.users_ids.split(' ')
    var details ={
      image_id: images[this.state.currentImage].id,
      users_ids : users_ids
    }
    shareImage(details).then(res => {})  
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
            <Button variant="dark" className="mr-5"  key="deleteImage" onClick={this.onDeleteImage}>
              Delete
            </Button>,
            <input
              type="text"
              className="form-control"
              style={{maxWidth: '50%'}}
              name="users_ids"
              placeholder="id1 id2 ..."
              required
              value={this.state.users_ids}
              onChange={this.onChange}
            />,
            <Button variant="dark" className = "px-5" key="shareImage" onClick={this.onShareImage}>
              Share
            </Button>,
            <Button variant="dark" className="ml-5" key="addInAlbum" onClick={this.toggleShareModal}>
              Add to album
            </Button>,
          ]}
        />
        </div>       
    )
  }
}


export default Home