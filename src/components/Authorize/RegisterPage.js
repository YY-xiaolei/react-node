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
class RegisterPage extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired
  };
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };
  componentWillMount() {
    this.state = {
      'nick_name': '',
      'email': '',
      'password': '',
      'confirm': '',
      'error': '',
      'is_subscribe': true
    };
  }
  componentDidMount() {
    this.setState({
      'screenH': screen.height * .73 + 'px'
    });
  }
  valueChange() {
    this.state[event.target.name] = event.target.value;
    this.setState(this.state);
  }
  registerSubmit(e) {
    e.preventDefault();
    if(this.state.nick_name === '') {
      Dialog.showWarning('Please enter your user name');
      return;
    }
    if(this.state.email === '') {
      Dialog.showWarning('Please enter your email address');
      return;
    }
    if(this.state.password === '') {
      Dialog.showWarning('Please enter your password');
      return;
    }
    if(this.state.confirm === '') {
      Dialog.showWarning('Please confirm your password');
      return;
    }
    if(this.state.password !== this.state.confirm) {
      Dialog.showWarning('Passwords do not match');
      return;
    }
    if(!Verify.isEmail(this.state.email)) {
      Dialog.showWarning('Please enter a valid email address (Example: name@domain.com)');
      return;
    }
    if(this.state.password.length < 8 || this.state.password.length > 20){
      Dialog.showWarning('Please enter a valid password (Minimum length: 8 characters)');
      return;
    }
    let body = {
      'nick_name': this.state.nick_name,
      'email': this.state.email,
      'password': this.state.password,
      'is_subscribe': this.state.is_subscribe,
      'invitation_code': AppActions.getUrlParam().invite
    };
    if(!AppActions.getUser().token) {
      body['order_id'] = AppActions.getUser().order_id
    } else {
      AppActions.signOut();
    }
    AppActions.postData(
      'POST',
      '/api/registrations',
      (json) => {
        if(json.token) {
          AppActions.signIn(json);
          let url = AppActions.getUrlParam().back ? '/' + AppActions.getUrlParam().back : '/member';
          Dialog.showSuccess('Complete');
          fbq('track', 'CompleteRegistration');
          AppActions.navigateTo(url);
        } else {
          Dialog.showWarning(json);
        }
      },
      body
    );
  }

  errorClose() {
    this.setState({
      error: ''
    });
  }

  subscribe() {
    this.setState({
      'is_subscribe': this.state.is_subscribe ? false : true
    });
  }
  facebookLoginDig() {
      FB.login(function(response) {
        console.log(response);
        FB.api('/me?fields=name,email',{ locale: 'en_US', fields: 'name, email' }, function(response) {
            AppActions.postData(
              'POST',
              '/api/sessions/third_party_login',
              (json) => {
                console.info(json);
                if(json.token) {
                  AppActions.signOut();
                  json.profile.nick_name = json.nick_name;
                  AppActions.signIn(json);
                  let url = AppActions.getUrlParam().back ? '/' + AppActions.getUrlParam().back : '/member';
                  AppActions.navigateTo(url);
                  localStorage.setItem("cartCount",json.item_count || '');
                } else {
                  Dialog.showWarning(json);
                }
              },
              {"user":{"login":response.email || "", "uid":response.id, "third_party": "facebook", "nick_name": response.name}}
            );
            console.log(response);
        });
      }, {scope: 'public_profile,email,user_birthday'});
    }
  render() {
    let title = 'New User Registration';
    this.context.onSetTitle(title);
    return (
      <div className="Authorize">
        <div className="Authorize-container">
          <div className='Login' style={{'minHeight': this.state.screenH}}>
            <div className={classnames('loginTip ui-flex', !this.state.error ? '' : 'show')}>
              <span className="cell-11">{this.state.error}</span>
              <i className="iconfont cell-1" onClick={this.errorClose.bind(this)}>&#xe646;</i>
            </div>
            <h3 className="title">Create Your Account</h3>
            <form onSubmit={this.registerSubmit.bind(this)}>
              <ul className="input">
                <li>
                  <div className="input-box">
                    <i className="iconfont" style={{'fontSize': '1.6rem', 'lineHeight': '1.8rem'}}>&#xe607;</i>
                    <input type='text' maxLength="200" name='nick_name' placeholder='User Name' value={this.state.nick_name} onChange={this.valueChange.bind(this)} />
                  </div>
                </li>
                <li>
                  <div className="input-box">
                    <i className="iconfont" style={{'fontSize': '1.2rem', 'lineHeight': '1.8rem'}}>&#xe62d;</i>
                    <input type='email' maxLength="200" name='email' placeholder='Email' value={this.state.email} onChange={this.valueChange.bind(this)} />
                  </div>
                </li>
                <li>
                  <div className="input-box">
                    <i className="iconfont">&#xe602;</i>
                    <input type='password' name="password" maxLength="20" placeholder='Password' value={this.state.password} onChange={this.valueChange.bind(this)} />
                  </div>
                </li>
                <li>
                  <div className="input-box">
                    <i className="iconfont">&#xe602;</i>
                    <input type='password' name="confirm" maxLength="20" placeholder='Confirm Password' value={this.state.confirm} onChange={this.valueChange.bind(this)} />
                  </div>
                </li>
                <li className='auth-act'>
                  <span onClick={this.subscribe.bind(this)}>
                    {this.state.is_subscribe ?
                      <i className='iconfont checked'>&#xe633;</i> :
                      <i className='iconfont'>&#xe634;</i>
                    }
                    Subscribe me to the Anker Newsletter
                  </span>
                </li>
                <li><button className='submit' type='submit'>REGISTER</button></li>
                <li><a href="/login" onClick={Link.handleClick} className='cancel'>CANCEL, RETURN TO LOG IN</a></li>
              </ul>
            </form>
            <ul className="third hide">
              <li className='log-or'>
                <i className='cell'></i>
                <span className='cell-1'>Connect to</span>
                <i className='cell'></i>
              </li>
              <li className="log-ass hide">
                <div ><i onClick={this.facebookLoginDig.bind(this)} className="iconfont">&#xe60f;</i></div>
                <div style = {{'display':'none'}}><i className="iconfont">&#xe610;</i></div>
                <div style = {{'display':'none'}}><i className="iconfont">&#xe62c;</i></div>
                <div style = {{'display':'none'}}><i className="iconfont">&#xe612;</i></div>
              </li>
            </ul>

          </div>

        </div>
      </div>
    );
  }

}

export default RegisterPage;
