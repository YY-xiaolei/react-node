/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './Authorize.less';
import AppActions from '../../actions/AppActions';
import classnames from 'classnames';
import Link from '../../utils/Link';
import Dialog from '../../utils/Dialog';
import Verify from '../../utils/Verify';

@withStyles(styles)
class ForgetPage extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired
  };
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.state = {
      'email': ''
    };
  }

  componentDidMount() {
    if(AppActions.getUser().token) {
      AppActions.navigateTo('/member');
    }
    this.setState({
      'screenH': screen.height * .8 + 'px'
    });
  }

  valueChange() {
    this.state[event.target.name] = event.target.value;
    this.setState(this.state);
  }

  forgetSubmit(e) {
    e.preventDefault();
    if(this.state.email === ''){
      Dialog.showWarning('Please enter your email address');
      return;
    }
    if(!Verify.isEmail(this.state.email)){
      Dialog.showWarning('Please enter a valid email address (Example: name@domain.com)');
      return;
    }
    AppActions.postData(
      'POST',
      '/api/user_passwords',
      (json) => {
        if(json.result && json.result === 'ok') {
          Dialog.showSuccess('We’ve sent you a link to reset your password');
          AppActions.navigateTo("/login");
        } else {
          Dialog.showWarning(json);
        }
      },
      {
        'email': this.state.email,
        'host': window.location.protocol + '//' + window.location.host
      }
    );
  }

  errorClose() {
    this.setState({
      error: ''
    });
  }

  render() {
    let title = 'Retrieve Password';
    this.context.onSetTitle(title);
    return (
      <div className="Authorize">
        <div className="Authorize-container">

          <div className='Login' style={{'minHeight': this.state.screenH}}>

            <div className={classnames('loginTip ui-flex', !this.state.error ? '' : 'show')}>
              <span className="cell-11">{this.state.error}</span>
              <i className="iconfont cell-1" onClick={this.errorClose.bind(this)}>&#xe646;</i>
            </div>

            <h3 className="title">Retrieve Password</h3>

            <form onSubmit={this.forgetSubmit.bind(this)}>
              <ul className="input">
                <li>
                  <div className="input-box">
                    <i className="iconfont" style={{'fontSize': '1.2rem', 'lineHeight': '1.8rem'}}>&#xe62d;</i>
                    <input type='email' name='email' placeholder='Email' value={this.state.email} onChange={this.valueChange.bind(this)} />
                  </div>
                </li>
                <li><button className='submit' type='submit'>SUBMIT</button></li>
                <li><a href="/login" onClick={Link.handleClick} className='cancel'>CANCEL, RETURN TO LOG IN</a></li>
              </ul>
            </form>

          </div>

        </div>
      </div>
    );
  }

}

export default ForgetPage;
