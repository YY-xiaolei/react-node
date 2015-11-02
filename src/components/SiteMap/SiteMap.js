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
      <div className="SiteMap">
        <ul>
          <li>
            <a href="/" title="Anker.com">Home</a>
          </li>
        </ul>
      </div>
    );
  }

}

export default Footer;
