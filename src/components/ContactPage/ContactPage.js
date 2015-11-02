/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes } from 'react';
import styles from './ContactPage.less';
import withStyles from '../../decorators/withStyles';

@withStyles(styles)
class ContactPage {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  render() {
    let title = 'Contact Us';
    this.context.onSetTitle(title);
    return (
      <div className="ContactPage">
        <div className="title">
          <h2>Contact Us</h2>
          <center>Whatever your question, we’re here to help.</center>
        </div>
        <div className="content">
          <h3>Customer Service Inquiries</h3>
          <p>Please get in touch about any issues you’re having, and we’ll try our best to respond with 24 hours.</p>
          <ul>
            <li><span>support@anker.com</span><a href="mailto:support@anker.com"><i className="iconfont">&#xe640;</i></a></li>
            <li><span>Please call 1-800-988-7973 Mon-Fri 9AM-5PM (PST)</span><a href="tel:1-800-988-7973"><i className="iconfont">&#xe603;</i></a></li>
          </ul>
        </div>
      </div>
    );
  }

}

export default ContactPage;
