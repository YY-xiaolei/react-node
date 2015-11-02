/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './NotFoundPage.less';
import AppActions from '../../actions/AppActions';

@withStyles(styles)
class NotFoundPage {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
    onPageNotFound: PropTypes.func.isRequired
  };

  componentDidMount() {
    setTimeOut(() => {
      AppActions.navigateTo('/');
    }, 8000)
  }

  render() {
    this.context.onSetTitle('404');
    this.context.onPageNotFound();
    return (
      <div className="page404">
        <h1>"404!"</h1>
        <p>"page not found!"</p>
      </div>
    );
  }

}

export default NotFoundPage;
