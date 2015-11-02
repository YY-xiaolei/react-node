/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import 'newrelic';
import 'babel/polyfill';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import React from 'react';
import './core/Dispatcher';
import './stores/AppStore';
import db from './core/Database';
import App from './components/App';
import formidable from 'formidable';
const server = express();

server.set('port', (process.env.PORT || 5000));
server.use(express.static(path.join(__dirname, 'public')));
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

//
// Register API middleware
// -----------------------------------------------------------------------------
server.use('/api', require('./api/query'));

server.post('/file', async (req, res) => {
  var form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    var data = await db.httpFileUpload(files.fileName.path, req.body, req.cookies, 'file');
    fs.unlinkSync(files.fileName.path);
    res.json(data.body);
  });
});

server.post('*', async (req, res, next) => {
  try {
    var data = await db.httpData(req.path, req.body, req.cookies, 'post');
    if((req.path === '/api/sessions' || req.path === '/api/registrations' || req.path === '/api/sessions/third_party_login') && data.body.token) {
      req.cookies["token"] = data.body.token;
      var data2  = await db.httpData('/api/users/profile', {}, req.cookies, 'get');
      data.body.profile = data2.body;
      res.status(data2.status).send(data.body);
    } else {
      res.status(data.status).send(data.body);
    }
    //res.send('')
  } catch (err) {
    next(err);
  }
});

server.delete('*', async (req, res, next) => {
  try {
    var data = await db.httpData(req.path, req.body, req.cookies, 'delete');
    res.status(data.status).send(data.body);
  } catch (err) {
    next(err);
  }
});

server.put('*', async (req, res, next) => {
  try {
    var data = await db.httpData(req.path.replace('/password', ''), req.body, req.cookies, 'put');
    res.status(data.status).send(data.body);
  } catch(err) {
    next(err);
  }
});

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------

// The top-level React component + HTML template for it
const templateFile = path.join(__dirname, 'templates/index.html');
const template = _.template(fs.readFileSync(templateFile, 'utf8'));

let stats = require('../stats.json');

server.get('*', async (req, res, next) => {

  //搜索引擎判断
  let seo = false;
  let spider = [
    'facebookexternalhit',    // facebook
    'Googlebot',              // google
    'developers.google.com',  // google+
    'bingbot',      // bing
    'msnbot',       // msn
    'linkedinbot',  // linkedin
    'Pinterest',    // pinterest
    'Yahoo',        // Yahoo
    'Slurp',        // Yahoo
    'Baiduspider',  // baidu
    'Sosospider',   // soso
    '360spider',    // 360
    'yodaobot',     // youdao
    'sogou',        // sogou
    'Twitterbot',   // Twiter
    'ia_archiver',
    'Lycos',
    'AltaVista',
    'Teoma'
  ];
  for (let i in spider) {
    if(req.headers['user-agent'].indexOf(spider[i]) > -1) {
      seo = true;
    }
  }
  if(req.path.indexOf('productpage')> -1 || req.path.indexOf('activity')> -1){
    seo = true;
  }
  //广告代码存储
  if(req.query.ref) {
    res.cookie(req.query.ref, 'ref', { maxAge: 1209600000, httpOnly: true });
  };

  //去beta代码
  if(req.path.indexOf('/beta') > -1) {
    let betaUrl = req.originalUrl.replace('/beta/','/').replace('/beta','')
    res.redirect(betaUrl ? betaUrl : '/');
  }

  try {
    var initialData =  seo ? (await db.httpData(req.path, req.query, req.cookies, 'GET')) : {
      'body': 'no api',
      'status': 200
    };
    let notFound = false;
    let css = [];
    let data = {description: ''};
    let app = (<App
      path={req.path}
      data={initialData.body}
      context={{
        onInsertCss: value => css.push(value),
        onSetTitle: value => data.title = value,
        onSetMeta: (key, value) => data[key] = value,
        onPageNotFound: () => notFound = true
      }} />);
    data.body = React.renderToString(app);
    data.css = css.join('');
    data.app_url = stats.main[0];
    if(req.path.indexOf('productpage')> -1){
      data.meta = {
        "facebookTitle":initialData.body.name,
        "facebookDesc":initialData.body.description,
        "shareUrl":req.headers.referer,
        "shareImage":initialData.body.variants[0].images[0].product_url
      };
    }else if(req.path.indexOf('activity')> -1){
      data.meta = {
        "facebookTitle":initialData.body.share_title,
        "facebookDesc":initialData.body.share_content,
        "shareUrl":req.headers.referer,
        "shareImage":initialData.body.share_image ? initialData.body.share_image.product_url : ""
      };
    }else{
      data.meta = {};
    }
    data.user_id = req.cookies.token;
    let html = template(data);
    if (notFound) {
      res.status(404);
    }
    res.send(html);
  } catch (err) {
    next(err);
  }
});

//
// Launch the server
// -----------------------------------------------------------------------------
server.listen(server.get('port'), () => {
  if (process.send) {
    process.send('online');
  } else {
    console.log('The server is running at http://localhost:' + server.get('port'));
  }
});
