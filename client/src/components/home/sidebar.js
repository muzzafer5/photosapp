import React, { Component } from 'react'
import {Card,Button, Nav} from "react-bootstrap"
class SideBar extends Component {

constructor(props){
    super(props)
    this.state = {
        path : this.props.location.pathname
    }
  }

  ChnageBgColorWhite(e){
    if(e.target.style.backgroundColor == "rgb(242, 242, 242)"){
        e.target.style.backgroundColor = "white"
    }
  }

  ChnageBgColorGrey(e){
    if(e.target.style.backgroundColor == "white"){
        e.target.style.backgroundColor = "rgb(242, 242, 242)"
    }
  }

  render() {
    return (  
        <div
          style = {{
            zIndex : "100",
            minHeight: "90vh",
            padding : "20px 0px"
          }}
        >
            <div>
                <Button variant="outline-light" onMouseEnter = {(e)=>this.ChnageBgColorGrey(e)} onMouseLeave = {(e)=>this.ChnageBgColorWhite(e)}
                    style = {{
                        backgroundColor :this.state.path == '/home' ? "#effce8": "white",
                        color : "black",
                        width : "90%",
                        margin : "5px 0px",
                        borderRadius : "0px 20px 20px 0px"
                    }}
                    onClick = {()=>this.props.history.push('/home')}
                >
                    Photos
                </Button>
            </div>
            <div>
                <Button variant="outline-light" onMouseEnter={(e) => this.ChnageBgColorGrey(e)} onMouseLeave={(e) => this.ChnageBgColorWhite(e)}
                    style={{
                        backgroundColor: this.state.path == '/myphotos' ? "#effce8" : "white",
                        color: "black",
                        width: "90%",
                        margin: "5px 0px",
                        borderRadius: "0px 20px 20px 0px"
                    }}
                    onClick={() => this.props.history.push('/myphotos')}
                >
                    Private
                </Button>
            </div>
            <div>
                <Button variant="outline-light" onMouseEnter = {(e)=>this.ChnageBgColorGrey(e)} onMouseLeave = {(e)=>this.ChnageBgColorWhite(e)}
                    style = {{
                        backgroundColor :this.state.path == '/shared' ? "#effce8": "white",
                        color : "black",
                        width : "90%",
                        margin : "5px 0px",
                        borderRadius : "0px 20px 20px 0px"
                    }}
                    onClick = {()=>this.props.history.push('/shared')}
                >
                    Shared
                </Button>
            </div>
            <div>
            <Button variant="outline-light" onMouseEnter = {(e)=>this.ChnageBgColorGrey(e)} onMouseLeave = {(e)=>this.ChnageBgColorWhite(e)}
                style = {{
                    backgroundColor: this.state.path.startsWith('/album') ? "#effce8": "white",
                    color : "black",
                    width : "90%",
                    margin : "5px 0px",
                    borderRadius : "0px 20px 20px 0px"
                }}
                onClick = {()=>this.props.history.push('/album')}
            >
                Album
            </Button>
            </div>
        </div>
    )
  }
}

export default SideBar