import api from './api'
// import store from '../store'

var _timer = null

export default {
  async login(login, senha, negocio, lembrar=false){
    return await api.post('api/authentication/auth', {login : login, senha : senha, negocio: negocio}).then(async response => {
      try {
        var auth = await processlogin(response)
        if (auth){
          sessionStorage.setItem('utoken', auth.token)
          if (lembrar){
            localStorage.setItem('utoken', auth.token)
            localStorage.setItem('uLembrar', lembrar)
          }else{
            localStorage.removeItem('utoken')
            localStorage.removeItem('uLembrar')
          }
        } else {
          sessionStorage.removeItem('utoken')
          localStorage.removeItem('utoken')
          localStorage.removeItem('uLembrar')
        }
        return Promise.resolve(auth);
      } catch (error) {
        sessionStorage.removeItem('utoken')
        localStorage.removeItem('utoken')
        throw error        
      }
    }).catch(function (error) {
      sessionStorage.removeItem('utoken')
      localStorage.removeItem('utoken')
      return Promise.reject(error);
    });
  },  
  async onAuthChanged(callback){
    await onAuth(async usuario => {
      await callback(usuario)
    })
    clearInterval(_timer)
    _timer = setInterval(async ()=>{
      await onAuth(async usuario => {
        await callback(usuario)
      })
    }, (process.env.INTERVA_ONAUTH || 120000)) // defaul Intervalo de 2 min
  },
  async logout(){
    sessionStorage.removeItem('utoken')
    localStorage.removeItem('utoken')
  }
}

var onAuth = async (callback) => {
  var token = sessionStorage.getItem('utoken') || localStorage.getItem('utoken')
  if (token) {
    await api.get('api/authentication/onauth/'+token).then(async (response) => {
      try {
        var auth = await processlogin(response)
        if (auth){
          sessionStorage.setItem('utoken', auth.token)
          if (localStorage.getItem('uLembrar')){
            localStorage.setItem('utoken', auth.token)
          }
        } else {
          sessionStorage.removeItem('utoken')
          localStorage.removeItem('utoken')
        }
        callback(auth);
      } catch (error) {
        sessionStorage.removeItem('utoken')
        localStorage.removeItem('utoken')
        callback(null)
      }
      
      // eslint-disable-next-line no-unused-vars
      }).catch(error => {
        sessionStorage.removeItem('utoken')
        localStorage.removeItem('utoken')
        callback(null)
      });
  } else {
    sessionStorage.removeItem('utoken')
    localStorage.removeItem('utoken')
    callback(null)
  }
}

var processlogin = async response => {
  if (response.status === 200 && response.data && response.data.success){
    return response.data.data
  } else if (response.status === 200 && response.data && !response.data.success && response.data.data){
    // console.error('processResponse.message: ', response.data.data)
    throw { errorType: 'info', message: response.data.data} 
  } else {
    // console.info('processResponse.erro: ', response.data.data)
    throw  { errorType: 'error', message: response.data.data} 
  }
}
