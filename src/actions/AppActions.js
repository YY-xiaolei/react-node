/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import http from 'superagent';
import Cookie from 'react-cookie';
import { canUseDOM } from 'react/lib/ExecutionEnvironment';
import Dispatcher from '../core/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import Dialog from '../utils/Dialog';

export default {
  navigateTo(path, options) {
    this.getData('GET', path, (json, err) => {
      if (canUseDOM) {
        if (options && options.replace) {
          window.history.replaceState({}, document.title, path);
        } else {
          window.history.pushState({}, document.title, path);
        }
      }
      Dispatcher.dispatch({
        type: ActionTypes.CHANGE_LOCATION,
        path,
        err,
        page: json ? json : null
      });
    });
  },
  getData(method, path, cb) {
    if(Math.min(window.screen.width,window.outerWidth) >= 768 && (path.indexOf('/password') === -1) && (path.indexOf('/register') === -1)) {
      Dialog.showTips(
        {
          'content': "This version of our website has been optimized for smartphones. You will now be redirected to our desktop site."
        })
      setTimeout(function() {
        location.href= 'http://www.ianker.com?country=gloabl';
      }, 4000)
    };
    if(path === '/password' && !this.getUser().token && !this.getUrlParam().token) {
      this.navigateTo('/login');
      return;
    }
    let param = '';
    if(path.indexOf('?') > -1) {
      param = path.slice(path.indexOf('?')).replace('?', '&');
      path = path.slice(0, path.indexOf('?'));
    }
    path = '/api?path=' + encodeURI(path) + encodeURI(param ? param : '');
    this.postData(method, path, cb);
  },
  postData(method, path, cb, body) {
    this.loading(true);
    http(method, path)
      .send(body)
      .accept('application/json')
      .end((err, res) => {
        this.loading(false);
        if(res.status === 401) {
          if(this.getUser().token) {
            this.signOut();
          } else if(this.getUser().order_token && this.getUser().order_id) {
            this.removeOrder();
          }
          this.navigateTo('/login');
        } else {
          cb(res.body);
        }
      });
  },
  loadPage(path) {
    Dispatcher.dispatch({
      type: ActionTypes.GET_PAGE,
      path
    });
  },
  getUser() {
    return {
      'token': !Cookie.load('token') ? '' : Cookie.load('token'),
      'order_id': !Cookie.load('order_id') ? '' : Cookie.load('order_id'),
      'order_token': !Cookie.load('order_token') ? '' : Cookie.load('order_token'),
      'email': !localStorage.getItem('email') ? '' : localStorage.getItem('email'),
      'nick_name': !localStorage.getItem('nick_name') ? '' : localStorage.getItem('nick_name'),
      'avatar': !localStorage.getItem('avatar_image') ? '' : localStorage.getItem('avatar_image'),
      'invitation_code': !localStorage.getItem('invitation_code') ? '' : localStorage.getItem('invitation_code')
    };
  },
  removeOrder() {
    Cookie.remove('order_id');
    Cookie.remove('order_token');
    localStorage.removeItem('cartCount');
  },
  changeToken(token) {
    if(this.getUser().token) {
      Cookie.save('token', token);
    }
  },
  tempOrderToken(token) {
    Cookie.save('temp_order_token', token);
  },
  getTempOrderToken(){
    return Cookie.load('temp_order_token');
  },
  visitor(json) {
    Cookie.save('order_id', json.number);
    Cookie.save('order_token', json.token);
  },
  regWithAddress(json) {
    Cookie.save('token', json.token);
    localStorage.setItem('email', json.email);
    localStorage.setItem('nick_name', json.nick_name)
  },
  signIn(json) {
    Cookie.save('token', json.token);
    if(json.profile) {
      localStorage.setItem('email', (json.profile.email ? json.profile.email : ''));
      localStorage.setItem('nick_name', (json.profile.nick_name ? json.profile.nick_name : ''));
      localStorage.setItem('avatar_image', (json.profile.avatar_image ? json.profile.avatar_image.mini_url : ''));
      localStorage.setItem('invitation_code', (json.profile.invitation_code? json.profile.invitation_code : ''));
    }
    if(json.order_id && json.order_token) {
      Cookie.save('order_id', json.order_id);
      Cookie.save('order_token', json.order_token);
    } else {
      Cookie.remove('order_id');
      Cookie.remove('order_token');
    }
    localStorage.removeItem('user_password');
    localStorage.removeItem('order_price');
    localStorage.removeItem('purchase');
  },
  signOut() {
    Cookie.remove('token');
    Cookie.remove('order_id');
    Cookie.remove('order_token');
    localStorage.removeItem('email');
    localStorage.removeItem('profile');
    localStorage.removeItem('cartCount');
    localStorage.removeItem('nick_name');
    localStorage.removeItem('avatar_image');
    localStorage.removeItem('invitation_code');
    localStorage.removeItem('user_password');
    localStorage.removeItem('order_price');
    localStorage.removeItem('purchase');
  },
  getUrlParam() {
    let search = window.location.search.replace('?', '').split('&');
    let params = {};
    for(let i in search) {
      let key = search[i].split('=')[0];
      let value = search[i].split('=')[1];
      params[key] = value;
    }
    return(params);
  },
  loading(bool) {
    let loading = document.createElement('div');
    loading.id = 'loading';
    loading.innerHTML = '<div class="loading-cell"><i class="iconfont">&#xe63a;</i><span>loading...</span></div>';
    if(bool) {
      if(!document.getElementById('loading')) {
        document.body.appendChild(loading);
      }
    } else {
      if(document.getElementById('loading')) {
        document.body.removeChild(document.getElementById('loading'));
      }
    }
  }
};
