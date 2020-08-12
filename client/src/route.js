import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Navbar from './components/home/navbar'
import Footer from './components/home/footer'
import Sidebar from './components/home/sidebar'

export const ProtectedRoute = ({ component: Component , ...rest})=>{
    return (
        <Route 
            {...rest}  
            component={(props)=>(
                <div>
                    <Navbar {...props}/> {/* HEADER ALWAYS VISIBLE */}
                    <div className = "row">
                        <div className = "col-2">
                            <Sidebar {...props}/>
                        </div>
                        <div className = "col-10">
                            <Component {...props} />
                           
                        </div>
                    </div>
                    <Footer {...props}/> {/* FOOTER ALWAYS VISIBLE */}
                </div>
            )}
        />
    )
}
