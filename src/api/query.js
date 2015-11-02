/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import { Router } from 'express';
import db from '../core/Database';

const router = new Router();

router.get('/', async (req, res, next) => {
  try {
    let path = req.query.path;
    delete req.query.path;
    let seach = req.query;
    if (!path) {
      res.status(400).send({error: `The 'path' query parameter cannot be empty.`});
    }
    //let page = await db.getPage(path);
    let data = await db.httpData(path, seach, req.cookies, 'GET');
    res.status(data.status).send(data.body)
  } catch (err) {
    next(err);
  }
});


export default router;
