import React, { Component } from 'react'
import {Card,Button} from "react-bootstrap"
import {fetch} from './ConnectServer'

class Shared extends Component {

  constructor(){
    super()
    this.state = {
      photos : []
    }
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

  
  render() {

    return (  
        <div >
          {
            this.state.photos?
              (
                this.state.photos.map((data,index) =>(
                  <span 
                    style = {{
                      margin : "1px"
                    }}
                    key = {index}
                  >
                    <img height = "150px"src = {require('../../../public/uploads/'+data.image.filename)} alt = "pic" />
                  </span>
                ))
              ):''
          }
        </div>
        
    )
  }
}


export default Shared