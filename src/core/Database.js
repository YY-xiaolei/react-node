/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import fs from 'fs';
import path from 'path';
import jade from 'jade';
import fm from 'front-matter';
import Dispatcher from './Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import http from 'superagent';
import config from '../config/config.js';

// Extract 'front matter' metadata and generate HTML
function parseJade(uri, jadeContent) {
  let content = fm(jadeContent);
  let html = jade.render(content.body, null, '  ');
  let page = Object.assign({path: uri, content: html}, content.attributes);
  return page;
}

export default {

  httpData: (uri, params, cookies, method) => {

    return new Promise((resolve) => {

      //不需要api数据返回的链接
      let need_api = true;
      let need_api_reg = [
        /^\/member$/,
        /^\/forget$/,
        /^\/register$/,
        /^\/faq$/,
        /^\/login$/,
        /^\/warranty$/,
        /^\/addressadd$/,
        /^\/about$/,
        /^\/privacypolicy$/,
        /^\/termofservice$/,
        /^\/contact$/,
        /^\/password$/,
        /^\/complete$/,
        /^\/shipping$/,
        /^\/product60w/
      ];
      need_api_reg.map(function(item) {
        if(item.test(uri)) {
          need_api = false;
          return ;
        }
      });

      //是否需要token检测
      let token_need = true;
      //根据请求headers和token_need，设置ap端request.headers
      let token_need_reg = [
        /^\/$/,
        /^\/index$/,
        /^\/activity$/,
        /^\/search$/,
        /^\/productlist$/,
        /^\/productpage$/,
        /^\/category$/,
        /^\/api\/products\/\d+\/reviews$/
      ];
      token_need_reg.map(function(item) {
        if(item.test(uri)) {
          token_need = false;
          return ;
        }
      })
      let headers = {};
      if(cookies['order_token']){
        headers['X-Spree-Order-Token'] = cookies['order_token'];
      }
      if(cookies['token'] && token_need) {
        headers['X-Spree-Token'] = cookies['token'];
      }
      if(cookies['platform']) {
        headers['platform'] = cookies['platform'];
      }
      //数据请求路径路由
      if(uri === '/' || uri === '/index'){
        uri = '/api/activities/';
      }
      else if(uri === '/activity') {
        uri = '/api/activities/' + params.id;
        params = {};
      }
      else if(uri === '/search') {
        uri = '/api/keywords/'
      }
      else if(uri === '/category') {
        uri = '/api/taxonomies/';
      }
      else if(uri === '/productlist') {
        if (params.keyword) {
          uri = '/api/products/search';
        } else {
          uri = '/api/products/search_by_taxon';
        }
      }
      else if(uri === '/productpage') {
        uri = '/api/products/' + params.id;
        params = {};
      }
      else if(uri === '/cart' || uri === '/orderaddress' || uri === '/delivery' || uri === '/payment' ) {
        uri = '/api/orders/current';
      }
      else if(uri === '/profile') {
        uri = '/api/users/profile';
      }
      else if(uri === '/feedback') {
        uri = '/api/feedback_items?page=1&per_page=50';
      }
      else if(uri === '/address') {
        uri = '/api/extend_addresses';
      }
      else if(uri === '/addressedit'){
        uri = '/api/extend_addresses/' + params.id;
      }
      else if(uri === "/orders") {
        uri = "/api/orders/history_order";
      }
      else if(uri === "/coupon") {
        uri = '/api/promotions/coupons';
      }
      else if(uri === "/orderdetail" ) {
        uri = "/api/orders/" + params.number;
      }
      else if(uri === "/review"){
        uri = "/api/orders/" + params.number + "/reviews?page=1&per_page=5";
      }
      /*
      if(uri === "/shipping") {
        uri = ""
      }*/
      else if(uri === "/orderdetail" ) {
        uri = "/api/orders/"+params.number;
      }

      /*历史订单token判断*/
      if(params.his && cookies['temp_order_token']){
        headers['X-Spree-Order-Token'] = cookies['temp_order_token'];
      }

      /*广告影响代码ref提交*/
      if(uri === '/api/orders/populate' || uri === '/api/registrations') {
        let ref = '';
        for(let i in cookies) {
          if(cookies[i] === 'ref') {
            ref = ref ? (ref + ',' + i) : i;
          }
        }
        params.ref = ref;
      }
    
      //开始API端数据请求
      if(need_api) {
        uri = (uri.indexOf("http://") > -1 ? uri : config.api + uri);
        http(method,  uri)
          .send(params)
          .set(headers)
          .accept('application/json')
          .end((err, res) => {
            for (let i in headers) {
              if(i.indexOf('Token') > -1) {
                headers[i] = '****************';
              }
            }
            for (let i in params) {
              if(i.indexOf('password') > -1) {
                params[i] = '********';
              }
            }
            console.log('[',new Date(),']', method, uri ,headers ,params ,res.status, (res.body.error || res.body.exception ? res.body : ''));
            try {
              resolve(res);
            } catch(e) {
              resolve({
                'body': {
                  'title': 'Error',
                  'content': 'Samething Wrong',
                },
                'status': 404
              });
            }
          });
      } else {
        resolve({
          'body': 'no api',
          'status': 200
        });
      }
    }).then((json) => {
      return Promise.resolve(json);
    });
  },

 httpFileUpload:(path, params, cookies, method) => {
  //根据请求headers和order_need，设置ap端request.headers
    let headers = {};
    if(cookies['token']) {
      headers['X-Spree-Token'] = cookies['token'];
    }
    if(cookies['platform']) {
      headers['platform'] = cookies['platform'];
    }
    return new Promise((resolve) => {
      http.post(config.api + '/api/users/edit_avatar')
      .set(headers)
      .attach('user[avatar_image]', path)
      .end(function(err, res){
        try {
            resolve(res);
          } catch(e) {
            resolve({
              'body': {
                'title': 'Error',
                'content': 'Same Wrong',
              },
              'status': 404
            });
          }
      });
    }).then((json) => {
      return Promise.resolve(json);
    });
  }
};

