import axios from 'axios'
import Auth from './auth'
/* axios.defaults.headers = {
  'X-CSRF-TOKEN': 'xxx'
} */
//  axios.defaults.withCredentials = true
// const BASE_URL = 'http://3.108.179.135:5000'
 const BASE_URL = 'http://localhost:8080'

const postConfig = {
  headers: {
    'Content-Type': 'application/json'
  }
}

export const getAuthConfig = () => {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: Auth.getAuthToken().trim()
    }
  }
}


export const getAuthConfigImage = () => {
  return {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: Auth.getAuthToken().trim()
    }
  }
}
export const post = async (url, payload, config = postConfig) => {
  const data = await axios.post(BASE_URL + url, payload, config)
  return data
}
export const deletes = async (url, payload) => {
  const data = await axios.delete(BASE_URL + url, { data: payload, ...getAuthConfig() });
  return data;
};

export const put = async (url, payload, config = postConfig) => {
  const data = await axios.put(BASE_URL + url, payload, config)
  return data
}


export const postwithOu = async (url, config,payload ) => {
  const data = await axios.post(BASE_URL + url, payload, config)
  return data
}

export const get = async (url, args) => {
  const data = await axios.get(BASE_URL + url,args)
  return data
}

export const dummyRequest = async (response) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(response)
    }, 1500)
  })
}
