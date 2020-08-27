import axios from 'axios'

export const upload = details => {

  var postData = details

  let axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
        'AUTHORIZATION':  localStorage.usertoken
    }
  }

  return axios
    .post('/api/v1/images/', postData, axiosConfig)
      .then(response => {
        return response.data
      })
      .catch(err => {
        console.log(err)
      })
} 

export const share = details => {

  var postData = details

  let axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
        'AUTHORIZATION':  localStorage.usertoken
    }
  }

  return axios
    .post('/image/share',postData, axiosConfig)
      .then(response => {
        return response.data
      })
      .catch(err => {
        console.log(err)
      })
} 


export const getAllImages = () => {

  let axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
        'AUTHORIZATION':  localStorage.usertoken
    }
  }

  return axios
    .get('/api/v1/images/',  axiosConfig)
      .then(response => {
        return response.data
      })
      .catch(err => {
        console.log(err)
      })
} 

export const getImage = (image_id) => {
  let axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
        'AUTHORIZATION':  localStorage.usertoken
    }
  }
  return axios
    .get('/api/v1/images/'+String(image_id)+'/', axiosConfig)
      .then(response => {
        return response.data
      }).catch(err =>{
        console.log(err)
      })
}

export const deleteImage = (image_id) => {
  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      'AUTHORIZATION': localStorage.usertoken
    }
  }
  return axios
    .delete('/api/v1/images/' + String(image_id) + '/', axiosConfig)
    .then(response => {
      return response.data
    }).catch(err => {
      console.log(err)
    })
}

export const getAllTags = () => {
  let axiosConfig = {
    headers:{
      'Content-Type':'application/json',
      'AUTHORIZATION': localStorage.usertoken
    }
  }
  return axios
    .get('http://localhost:8080/api/v1/tags', axiosConfig)
      .then(response => {
        return response.data
      }).catch(err =>{
        console.log(err)
        })
}
