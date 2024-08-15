import axios from 'axios'
import Auth from './auth'

const BASE_URL = 'http://localhost:8080'

const postConfig = {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
}

export const getAuthConfig = () => {
  const authFunctions = Auth()

  return {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Web ' + 'Admin ' + authFunctions.getAuthToken()
    }
  }
}

export const post = async (url, payload, config = postConfig) => {
  const data = await axios.post(BASE_URL + url, payload, config)
  return data
}

export const postwithOu = async (url, config, payload) => {
  const data = await axios.post(BASE_URL + url, payload, config)
  return data
}

export const get = async (url, args) => {
  const data = await axios.get(BASE_URL + url, args)
  return data
}

export const deletes = async (url, payload) => {
  const data = await axios.delete(BASE_URL + url, { data: payload, ...getAuthConfig() })
  return data
}

export const dummyRequest = async (response) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(response)
    }, 1500)
  })
}
