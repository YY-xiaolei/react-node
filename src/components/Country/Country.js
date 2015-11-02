/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './country.less';
import withViewport from '../../decorators/withViewport';
import withStyles from '../../decorators/withStyles';
import Link from '../../utils/Link';

@withViewport
@withStyles(styles)
class Footer {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  render() {
    let title = 'Country';
    this.context.onSetTitle(title);
    return (
      <div className="CountryList">
        <ul>
          <li>
            <a href="http://www.ianker.com?country=gloab"><img src={require("../../public/contry_ca.png")}  /><span>Canada</span></a>
          </li>
          <li>
            <a href="http://de.ianker.com"><img src={require("../../public/contry_de.png")}  /><span>Deutschland</span></a>
          </li>
          <li>
            <a href="http://www.ianker.com?country=gloab"><img src={require("../../public/contry_es.png")}  /><span>España</span></a>
          </li>
          <li>
            <a href="http://www.ianker.com?country=gloab"><img src={require("../../public/contry_fr.png")}  /><span>France</span></a>
          </li>
          <li>
            <a href="http://www.ianker.com?country=gloab"><img src={require("../../public/contry_it.png")}  /><span>Italia</span></a>
          </li>
          <li>
            <a href="http://jp.ianker.com"><img src={require("../../public/contry_jp.png")}  /><span>日本</span></a>
          </li>
          <li>
            <a href="http://www.ianker.com?country=gloab"><img src={require("../../public/contry_uk.png")}  /><span>UK</span></a>
          </li>
          <li>
            <a href="http://m.anker.com"><img src={require("../../public/contry_us.png")}  /><span>United States</span></a>
          </li>
        </ul>
      </div>
    );
  }

}

export default Footer;
