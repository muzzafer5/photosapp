import axios from 'axios'

export const signup = newUser => {
  var postData = newUser
  return axios
    .post('http://localhost:8080/api/v1/accounts/signup/', postData)
      .then(response => {
        console.log(response)
        alert(response.data)
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
    .post('http://localhost:8080/api/v1/accounts/login/', postData)
      .then(response => {
        return response.data
      })
      .catch(err => {
        console.log(err)
        alert("Invalid username or password")
      })
}

// export const logout = () =>{
//   return axios.post('http://localhost:8080/api/v1/accounts/logout/',{})
//   .then(
//     response => {
//       return response.status
//     }
//   ).catch(err =>{
//     console.log(err)
//     alert('Not able to logout')
//   })
// }