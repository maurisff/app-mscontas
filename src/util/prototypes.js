/* eslint-disable no-useless-escape */
import moment from 'moment'
// TODO: String -----------------------------------------------------------------------------------
String.prototype.retornaNumeros = function() {
  return (isNaN(this.valueOf().replace(/[^\d.,-]/g, '').replace(/\./gi, "").replace(/\,/gi, "."))? 0 : Number(this.valueOf().replace(/[^\d.,-]/g, '').replace(/\./gi, "").replace(/\,/gi, ".")))
}
// TODO: Number -----------------------------------------------------------------------------------
Number.prototype.toStringPrice = function(decinal = 2) {
  let val = (this.valueOf()/1).toFixed(decinal).replace('.', ',')
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}
// TODO: Date -----------------------------------------------------------------------------------
Date.prototype.trunc = function () {
  return new Date(this.valueOf()).setHours(0, 0, 0, 0)
}
Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}
Date.prototype.toStrDateVue = function() {
  var date = new Date(this.valueOf());
  return date.toISOString().split('T')[0];
}
Date.prototype.toStringFormatt = function(mask) {
  var date = new Date(this.valueOf());
  if (mask){
    return moment(date).format(mask)
  } else {
    return date.toISOString()
  }
}

// TODO: Array -----------------------------------------------------------------------------------
Array.prototype.arraySumProperty = function(property) {
  var array = this.valueOf()
  if (array && Array.isArray(array) && array.length > 0 && property){
    return array.map(ar => { return ar[property].toString().retornaNumeros() }).reduce((a,b) => a + b, 0)
  } else {
    return 0
  }
}