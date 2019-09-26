import axios from 'axios';

// console.log('API-Config: ', global.App, (sessionStorage.getItem('utoken') || localStorage.getItem('utoken')) )
const instance =  axios.create({ baseURL: (process.env.VUE_APP_ROOT_API ? process.env.VUE_APP_ROOT_API :  '/') })

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  // console.log('axios.instance.interceptors.request: ', config)
  config.headers['x-access-token'] = (sessionStorage.getItem('utoken') || localStorage.getItem('utoken'))
  // console.log('axios.instance.interceptors.request2: ', config)
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Do something with response data
  //console.log('axios.instance.interceptors.response: ', response)
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

export default instance
