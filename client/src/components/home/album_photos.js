import React, { Component } from 'react'
import { Card, Button } from "react-bootstrap"
import { getAlbum, getImage, deleteImage, shareImage, addToAlbum } from './ConnectServer'
import Gallery from 'react-grid-gallery';

class AlbumPhotos extends Component {
    constructor(props) {
        super(props)
        this.state = {
            images: [],
            users_ids: '',
            album_id: this.props.match.params.albumId,
            album_name: '',
            currentImage: 0
        }
        this.onChange = this.onChange.bind(this)
        this.onCurrentImageChange = this.onCurrentImageChange.bind(this)
        this.onDeleteImage = this.onDeleteImage.bind(this)
        this.onShareImage = this.onShareImage.bind(this)
        this.onAddAlbum = this.onAddAlbum.bind(this)
    }

    componentDidMount() {
        if (!localStorage.usertoken)
            this.props.history.push(`/`)
        getAlbum(this.state.album_id).then(res => {
            if (res) {
                res.images.map(id => {
                    getImage(id).then(res => {
                        var img_detail = {
                            src: res.uri,
                            thumbnail: res.uri,
                            id: res.id
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

    onShareImage() {
        var images = this.state.images.slice();
        var users_ids = this.state.users_ids.split(' ')
        var details = {
            image_id: images[this.state.currentImage].id,
            users_ids: users_ids
        }
        shareImage(details).then(res => {
            alert(`Image ${this.state.currentImage} is started sharing`)
        }).catch(err => {
            alert(`Invalid array of user id`)
        })
        this.setState({ users_ids: '' })
    }

    onAddAlbum() {
        var images = this.state.images.slice();
        var image_id = images[this.state.currentImage].id;
        var details = {
            name: this.state.album_name,
            images: [image_id]
        }
        console.log(details)
        addToAlbum(details).then(res => {
            alert(`Image ${this.state.currentImage} is added in album`)
        }).catch(err => {
            alert(`Invalid album name`)
        })
        this.setState({ album_name: '' })
    }
    render() {
        return (
            <div className="my-3">
                <Gallery
                    images={this.state.images}
                    enableLightbox={true}
                    enableImageSelection={false}
                    currentImageWillChange={this.onCurrentImageChange}
                    customControls={[
                        <Button variant="dark" className="mr-3" key="deleteImage" onClick={this.onDeleteImage}>
                            Delete
                        </Button>,
                        <input
                            type="text"
                            className="form-control"
                            name="users_ids"
                            placeholder="Enter users ids to share [id1 id2 ...]"
                            required
                            value={this.state.users_ids}
                            onChange={this.onChange}
                        />,
                        <Button variant="dark" className="px-3 mr-3 mx-1" key="shareImage" onClick={this.onShareImage}>
                            Share
                        </Button>,
                        <input
                            type="text"
                            className="form-control"
                            name="album_name"
                            placeholder="Enter album name"
                            required
                            value={this.state.album_name}
                            onChange={this.onChange}
                        />,
                        <Button variant="dark" className=" ml-1" key="addInAlbum" onClick={this.onAddAlbum}>
                            Add@Album
                        </Button>
                    ]}
                />

            </div>
        )
    }
}


export default AlbumPhotos