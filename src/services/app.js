import util from '@/util/Utils'
import api from '@/services/api'
import auth from '@/services/auth'

export default {
  ...util,
  ...api,
  ...auth
}
