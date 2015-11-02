/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes } from 'react';
import styles from './Footer.less';
import withViewport from '../../decorators/withViewport';
import withStyles from '../../decorators/withStyles';
import Link from '../../utils/Link';

@withViewport
@withStyles(styles)
class Footer {

  static propTypes = {
    viewport: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired
    }).isRequired
  };

  render() {
    return (
      <div className="Footer">
        <div className="country"><a href="/country" onClick={Link.handleClick}><img src={require('./USA.png')} alt="USA ONLY" /><span>United States</span></a></div>
        <div className="copyright"> Copyright © 2015 Anker Technology Co. Limited</div>
        <div className="about">
          <a href="/about" onClick={Link.handleClick}>About</a><span>｜</span> 
          <a href="/privacypolicy" onClick={Link.handleClick}>Privacy Policy</a><span>｜</span>
          <a href="/termofservice" onClick={Link.handleClick}>Terms of Use</a><span>｜</span>
          <a href="/warranty" onClick={Link.handleClick}>Warranty</a>
        </div>
      </div>
    );
  }

}

export default Footer;
