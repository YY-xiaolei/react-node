/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './Authorize.less';
import AppActions from '../../actions/AppActions';
import classnames from 'classnames';
import Link from '../../utils/Link';
import Dialog from '../../utils/Dialog';

@withStyles(styles)
class LoginPage extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired
  };
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };
  componentWillMount() {
    this.state = {
      'email': '',
      'password': ''
    };
  }
  componentDidMount() {
    if(AppActions.getUser().token) {
      let url = AppActions.getUrlParam().back ? '/' + AppActions.getUrlParam().back : '/member';
      AppActions.navigateTo(url);
    }
    this.state.screenH = screen.height * .7 + 'px';
    if(localStorage.getItem('remember') && localStorage.getItem('remember_email')) {
      this.state.email = localStorage.getItem('remember_email');
      this.state.remember = 1;
    }
    this.setState(this.state);
    window.fbAsyncInit = function() {
      FB.init({
        appId: '1495091067451264',
        xfbml: true,
        cookie : true,
        version: 'v2.4'
      });
    };
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return; }
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  valueChange() {
    this.state[event.target.name] = event.target.value;
    this.setState(this.state);
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

  remember() {
    localStorage.setItem('remember', !this.state.remember ? 1 : 0);
    this.setState({
      'remember': !this.state.remember ? 1 : 0
    });
  }

  loginSubmit(e) {
    e.preventDefault();
    if(this.state.email === '') {
      Dialog.showWarning("Please enter your email address");
      return;
    }
    if(this.state.password === '') {
      Dialog.showWarning("Please enter your password");
      return;
    }
    let body = {
      'email': this.state.email,
      'password': this.state.password
    };
    if(!AppActions.getUser().token) {
      body['order_id'] = AppActions.getUser().order_id;
    }
    AppActions.postData(
      'POST',
      '/api/sessions',
      (json) => {
        if(json.token) {
          AppActions.signOut();
          AppActions.signIn(json);
          this.state.remember ? localStorage.setItem('remember_email', body.email) : localStorage.setItem('remember_email','');
          let url = AppActions.getUrlParam().back ? '/' + AppActions.getUrlParam().back : '/member';
          AppActions.navigateTo(url);
          localStorage.setItem("cartCount",json.item_count);
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

  render() {
    let title = 'Log In';
    this.context.onSetTitle(title);
    return (
      <div className="Authorize">
        <div className="Authorize-container">

          <div className='Login' style={{'minHeight': this.state.screenH}}>

            <div className={classnames('loginTip ui-flex', !this.state.error ? '' : 'show')}>
              <span className="cell-11">{this.state.error}</span>
              <i className="iconfont cell-1" onClick={this.errorClose.bind(this)}>&#xe646;</i>
            </div>
            <h3 className="title">Log In</h3>
            <form onSubmit={this.loginSubmit.bind(this)}>
              <ul className="input">
                <li>
                  <div className="input-box">
                    <i className="iconfont" style={{'fontSize': '1.2rem', 'lineHeight': '1.8rem'}}>&#xe607;</i>
                    <input type='email' name='email' placeholder='Email' value={this.state.email} onChange={this.valueChange.bind(this)} />
                  </div>
                </li>
                <li>
                  <div className="input-box">
                    <i className="iconfont">&#xe602;</i>
                    <input type='password' name="password" maxLength="20" placeholder='Password' value={this.state.password} onChange={this.valueChange.bind(this)} />
                  </div>
                </li>
                <li><button className='submit' type='submit'>LOG IN</button></li>
                <li className='auth-act'>
                  <span onClick={this.remember.bind(this)}>
                    {!this.state.remember ?
                      <i className='iconfont'>&#xe634;</i> :
                      <i className='iconfont checked'>&#xe633;</i>
                    }
                    Remember me
                  </span>
                  <a href="/forget" onClick={Link.handleClick}>Forgot your password?</a>
                </li>
              </ul>
            </form>
            <p>Welcome to the Anker Mobile Store. </p>
            <p>Please click the link below to register. </p>
            <p>Existing ianker.com members should create an account using the same email address.</p>
            <ul className="third ">
              <li className='log-or hide'>
                <i className='cell'></i>
                <span className='cell-1'>Connect to</span>
                <i className='cell'></i>
              </li>
              <li className="log-ass hide">
                <div><i onClick={this.facebookLoginDig.bind(this)} className="iconfont">&#xe60f;</i></div>
                <div style = {{'display':'none'}} ><i className="iconfont">&#xe610;</i></div>
                <div style = {{'display':'none'}}><i className="iconfont">&#xe62c;</i></div>
                <div style = {{'display':'none'}}><i className="iconfont">&#xe612;</i></div>
              </li>
            
              <li className="log-sign">
                <a href="/register" onClick={Link.handleClick}>New to anker.com?</a> 
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;
