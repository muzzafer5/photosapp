import React, { Component } from 'react'
import {Card,Button} from "react-bootstrap"
import {getAllImages} from './ConnectServer'

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
    getAllImages().then(res=>{
      this.setState({photos : res})
      console.log(res)
    }) 
  }

  
  render() {

    return (  
        <div >
        </div>
        
    )
  }
}


export default Shared