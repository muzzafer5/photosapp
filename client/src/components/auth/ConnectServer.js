import axios from 'axios'

export const signup = newUser => {
  var postData = newUser
  return axios
    .post('/api/v1/accounts/signup/', postData)
      .then(response => {
        console.log(response.data)
        return response.data
      })
      .catch(err => {
        console.log(err)
        alert("Username already exist")
      })
} 

export const login = user => {
  var postData = user
  return axios
    .post('/api/v1/accounts/login/', postData)
      .then(response => {
        return response.data
      })
      .catch(err => {
        console.log(err)
        alert("Invalid username or password")
      })
}

export const call_logout = () =>{
  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      'AUTHORIZATION': localStorage.usertoken
    }
  }
  return axios
  .post('/api/v1/accounts/logout/', {}, axiosConfig).then(response => {
      return response.data
  })
  .catch(err => {
    console.log(err)
  })
}

