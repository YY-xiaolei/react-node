/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './PasswordPage.less';
import withStyles from '../../decorators/withStyles';
import AppActions from '../../actions/AppActions';
import Link from '../../utils/Link';
import Dialog from '../../utils/Dialog';

@withStyles(styles)
class PasswordPage extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired
  };
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };
  componentWillMount() {
    this.setState({
      'password': '',
      'password_confirmation': '',
      'original_password': '',
      'token': AppActions.getUser.token,
      'isShowOldPwd': false
    });
  }
  componentDidMount() {
    let urlToken = AppActions.getUrlParam().token || '';
    let original_password = AppActions.getUrlParam().pwd || '';
    let token = AppActions.getUser().token;
    this.state.urlToken = urlToken;
    if(!urlToken && (token || original_password)){
      this.state.isShowOldPwd = true;
      this.state.original_password = original_password;
    }
    this.setState(this.state);
  }
  changePassword() {
    event.preventDefault();
    if(this.state.isShowOldPwd  && this.state.original_password === ''){
      Dialog.showWarning('Please enter your old password');
      return;
    }
    if(this.state.password === ''){
      Dialog.showWarning('Please enter your new password');
      return;
    }
    if(this.state.password_confirmation === ''){
      Dialog.showWarning('Please confirm your new password');
      return;
    }
    if(this.state.password !== this.state.password_confirmation){
      Dialog.showWarning('Passwords do not match');
      return;
    }
    if(this.state.password.length < 8 || this.state.password.length > 20){
      Dialog.showWarning('Please enter a valid password (Minimum length: 8 characters)');
      return;
    }
    let body = {
      'password': this.state.password,
      'password_confirmation': this.state.password_confirmation
    };
    let url = '';
    if(this.state.urlToken) {
      body['reset_password_token'] = this.state.urlToken;
      url = 'api/user_passwords/update_by_token';
    } else {
      body['original_password'] = this.state.original_password;
      url = 'api/user_passwords/change_password';
    }
    AppActions.postData('PUT', url, (json) => {
      if(json.apikey) {
        AppActions.signOut();
        Dialog.showSuccess('Password change successful');
        location.href = '/login';
      } else {
        Dialog.showWarning(json);
      }
    }, body);
  }

  valueChange() {
    this.state[event.target.name] = event.target.value;
    this.setState(this.state);
  }

  render() {
    let title = 'Change Password';
    this.context.onSetTitle(title);
    return(
      <div className="PasswordPage">
        <div className="PasswordPage-container">
            <form onSubmit={this.changePassword.bind(this)}>
              <h5 className="title">Change Password</h5>
              <div className="input">
                {this.state.isShowOldPwd ?
                  <input type="password" placeholder="Old Password" name="original_password" value={this.state.original_password} onChange={this.valueChange.bind(this)}/>
                  : ''
                }
                <input type="password" placeholder="New Password" maxLength="20" name="password" value={this.state.password} onChange={this.valueChange.bind(this)}/>
                <input type="password" placeholder="Confirm" maxLength="20" name="password_confirmation" value={this.state.password_confirmation} onChange={this.valueChange.bind(this)}/>
              </div>
              <div className="action">
                <button type="submit" >CHANGE PASSWORD</button>
                <a href="/member" onClick={Link.handleClick}>CANCEL</a>
              </div>
            </form>

        </div>
      </div>
    );
  }

}

export default PasswordPage;
