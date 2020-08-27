import React, { Component } from 'react'
import {Card, Button, Modal} from "react-bootstrap"
import {getAllImages, getImage, deleteImage, shareImage} from './ConnectServer'
import Gallery from 'react-grid-gallery';

class Home extends Component {

  constructor(){
    super()
    this.state = {
      images : [],
      show_share_modal : false,
      user_id : '',
      currentImage: 0
    }
    this.onChange = this.onChange.bind(this)
    this.onCurrentImageChange = this.onCurrentImageChange.bind(this)
    this.onDeleteImage = this.onDeleteImage.bind(this)
    this.toggleShareModal = this.toggleShareModal.bind(this)
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

  toggleShareModal(){
    this.setState({show_share_modal : !this.state.show_share_modal})
  }

  onShareImage(){
    var images = this.state.images.slice();
    var details ={
      image_id: images[this.state.currentImage].id,
      user_id : this.state.user_id
    }
    shareImage(details).then(res => {
      images.splice(this.state.currentImage, 1)
      this.setState({
        images: images
      });
    })  
    this.setState({ show_share_modal: false })
  }
  
  render() {
    const modal = (
      <Modal centered show={this.state.show_share_modal} animation={false} styel = {{zIndex : 100}}>
        <Modal.Header closeButton onClick={this.toggleShareModal}>
          <Modal.Title>Share</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <div className="form-group my-3 mx-3">
            <label htmlFor="image_name">User ID</label>
            <input
              type="text"
              className="form-control"
              name="user_id"
              required
              placeholder="Enter the user id"
              value={this.state.user_id}
              onChange={this.onChange}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" className="btn btn-primary" onClick={this.onShareImage}>
            Share
          </Button>
        </Modal.Footer>
      </Modal>
    )
    return (  
        <div className = "my-3">
        <Gallery
          images={this.state.images}
          enableLightbox={true}
          enableImageSelection={false}
          currentImageWillChange={this.onCurrentImageChange}

          customControls={[
            <Button variant="dark"  key="deleteImage" onClick={this.onDeleteImage}>Delete</Button>,
            <Button variant="dark" key="shareImage" onClick={this.toggleShareModal}>Share</Button>,
            <Button variant="dark" key="addInAlbum" onClick={this.toggleShareModal}>Add to album</Button>
          ]}
        />
        {modal}
        </div>       
    )
  }
}


export default Home