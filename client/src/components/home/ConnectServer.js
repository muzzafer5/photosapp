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

export const createTag = details => {

  var postData = details

  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      'AUTHORIZATION': localStorage.usertoken
    }
  }

  return axios
    .post('/api/v1/tags/', postData, axiosConfig)
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
} 

export const shareImage = details => {

  var postData = {
    user_ids : details.user_ids
  }

  let axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
        'AUTHORIZATION':  localStorage.usertoken
    }
  }

  return axios
    .post('/api/v1/images/' + String(details.image_id) + '/share/',postData, axiosConfig)
      .then(response => {
        alert('started sharing')
        return response.data
      })
      .catch(err => {
        alert('Invalid user ids')
        console.log(err)
      })
} 

export const addToAlbum = details => {
  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      'AUTHORIZATION': localStorage.usertoken
    }
  }
 
  return axios
    .post('/api/v1/albums/', details, axiosConfig)
    .then(response => {
      alert('Added')
      return response.data
    })
    .catch(err => {
      getAllAlbums().then(res => {
        console.log(res)
        if (res) {
          res.album_ids.map(id => {
            getAlbum(id).then(res => {
              if(res.name == details.name){
                  details.id = id
                  putInAlbum(details).then(res=>{})
              }
            })
          })
        }
      })
    })
} 

export const putInAlbum = details => {
  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      'AUTHORIZATION': localStorage.usertoken
    }
  }
 
  var postData = {
    add : {
      image_ids : details.images
    }
  }

  return axios
    .put('/api/v1/albums/'+ String(details.id) + '/images/', postData, axiosConfig)
    .then(response => {
      alert('Added')
      return response.data
    })
    .catch(err => {
      alert('Invalid')
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

export const getAllAlbums = () => {

  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      'AUTHORIZATION': localStorage.usertoken
    }
  }

  return axios
    .get('/api/v1/albums/', axiosConfig)
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
} 


export const getAllSharedImages = () => {

  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      'AUTHORIZATION': localStorage.usertoken
    }
  }

  return axios
    .get('/api/v1/images/shared/', axiosConfig)
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}
export const getAllPrivateImages = () => {

  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      'AUTHORIZATION': localStorage.usertoken
    }
  }

  return axios
    .get('/api/v1/images/private/', axiosConfig)
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

export const getAlbum = (album_id) => {
  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      'AUTHORIZATION': localStorage.usertoken
    }
  }
  return axios
    .get('/api/v1/albums/' + String(album_id) + '/', axiosConfig)
    .then(response => {
      return response.data
    }).catch(err => {
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
    .get('/api/v1/tags/', axiosConfig)
      .then(response => {
        return response.data
      }).catch(err =>{
        console.log(err)
        })
}

export const getTag = (id) => {
  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      'AUTHORIZATION': localStorage.usertoken
    }
  }
  return axios
    .get('/api/v1/tags/' + String(id) + '/', axiosConfig)
    .then(response => {
      return response.data
    }).catch(err => {
      console.log(err)
    })
}
