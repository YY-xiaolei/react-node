/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, {Component} from 'react';
import AppActions from '../../actions/AppActions';
import styles from './OrderLogin.less';
import withStyles from '../../decorators/withStyles';
import Link from '../../utils/Link';
import Dialog from '../../utils/Dialog';
import Verify from '../../utils/Verify';

@withStyles(styles)
class OrderLogin extends Component {

  componentWillMount() {
    this.setState({
      'data': {
        'email': '',
        'password': ''
      }
    });
  }

  componentDidMount() {
    this.state.screenH = screen.height * .7 + 'px';
    this.setState(this.state);
  }

  accountAdd() {
    AppActions.navigateTo('/orderaddress?order_id=' + AppActions.getUser().order_id);
  }

  render() {
    return (
      <div className={'OrderLogin ' + this.props.show} style={{'minHeight': this.state.screenH}}>
        <div className="action">
          <a href="/login?back=cart" onClick={Link.handleClick}>LOG IN</a>
          <a href="/register?back=cart" onClick={Link.handleClick}>CREATE AN ACCOUNT</a>
          <a onClick={this.accountAdd.bind(this)}>CHECK OUT WITHOUT LOGGING IN</a>
        </div>
      </div>
    );
  }
}

export default OrderLogin;
