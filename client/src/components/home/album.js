import React, { Component } from 'react'
import {Card,Button} from "react-bootstrap"
import {getAllAlbums, getAlbum} from './ConnectServer'

class Album extends Component {

  constructor(){
    super()
    this.state = {
      albums : []
    }
  }

  componentDidMount() {
    if(!localStorage.usertoken)
      this.props.history.push(`/`)
    getAllAlbums().then(res => {
      if (res) {
        res.album_ids.map(id => {
          getAlbum(id).then(res => {
            this.setState({
              albums: [...this.state.albums, res]
            })
          })
        })
      }
    })
  }

  onEnterAlbum(albumId) {
    const albumURL = '/album/' + albumId
    this.props.history.push(albumURL)
  }
  
  render() {

    return (  
        <div >
          <div className="row">
            {
              this.state.albums ? (
                this.state.albums.map(data => (
                  <Card className="mr-3" key={data.id} style={{ width: '16rem' }}>
                    <Card.Body>
                      <Card.Title >{data.name}</Card.Title>
                      <Card.Text>
                        Images : {data.images.length}<br/>
                        Shared with : {data.shared_with.length}
                      </Card.Text>
                      <Button variant="dark" onClick={() => this.onEnterAlbum(data.id)}>Enter</Button>
                    </Card.Body>
                  </Card>
                ))
              ) : ''
            }
          </div>
        </div>
        
    )
  }
}


export default Album