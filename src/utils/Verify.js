/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */


export default {
  reg(argument) {
      return {
        nick_name: /^$/,
        email: /^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$/,
        phone: /^$/,
        zipcode: /\d{4,5}/,
        first_name: /^[a-zA-Z]{1,20}|[\u4e00-\u9fa5]{1,10}$/,
        last_name: /^[a-zA-Z]{1,20}|[\u4e00-\u9fa5]{1,10}$/,
        address1: /^[a-zA-Z]+$/,
        city: /^.*[^\s]+.*$/,
        contry_id: /^.*[^\s]+.*$/,
        state_id: /^.*[^\s]+.*$/,
      };
    },
    isEmail(val) {
      return this.reg().email.test(val);
    },
    isPhone(val) {
      return this.reg().phone.test(val);
    },
    creditFormat(val) {
      val = val.replace(/\s*/g, '').split('');
      let vt = '';
      for (let i in val) {
        if (i % 4 === 0) {
          vt += ' ';
        }
        vt += val[i];
      }
      return vt;
    },
    dateFormat(date, format) {
      let d, formatDate;
      typeof date != 'object' ? d = new Date(date) : d = date;
      let day = d.getDate(),
        month = d.getMonth() + 1,
        year = d.getFullYear(),
        hours = d.getHours(),
        min = d.getMinutes();
      if(format === 'mm-dd-yy') {
        formatDate = (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day) + '-' + year
      } else if(format === 'yy-mm-dd') {
        formatDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day)
      } else {
        formatDate = (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day) + '-' + year + '  ' + (hours > 9 ? hours : '0' + hours) + ':' + (min > 9 ? min : '0' + min);
      }
      return formatDate;
    }
};