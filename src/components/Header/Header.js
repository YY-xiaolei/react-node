/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './Header.less';
import Link from '../../utils/Link';
import AppActions from '../../actions/AppActions';

@withStyles(styles)
class Header extends Component {

  static propTypes = {
    data: PropTypes.object
  }

  componentWillMount() {
    this.setState({
      'showMenuList': false,
      'categoryList': [],
      'nick_name': '',
      'cartCount': 0
    });
  }
  componentDidMount() {
    this.state.nick_name = AppActions.getUser().nick_name || AppActions.getUser().email;
    this.state.cartCount = localStorage.getItem('cartCount') || 0;
    this.setState(this.state);
  }
  componentWillReceiveProps(nextProps) {
    this.state.nick_name = AppActions.getUser().nick_name || AppActions.getUser().email;
    this.state.cartCount = localStorage.getItem('cartCount') || 0;
    this.state.showMenuList = false;
    this.setState(this.state);
    document.getElementById('container').className = '';
    //this.showMenuList();
  }
  headBack(event) {
    event.preventDefault();
    window.history.back();
  }
  headCart(event) {
    event.preventDefault();
    AppActions.navigateTo(AppActions.getUser().token ? '/cart' : '/cart?order_id=' + AppActions.getUser().order_id);
    this.hideMenuList();
  }
  showMenuList() {
    this.setState({
      'showMenuList': true
    });
    document.getElementById('container').className = 'containerAll';
  }
  hideMenuList() {
    this.setState({
      'showMenuList': false
    });
    document.getElementById('container').className = '';
  }
  handleClick(event) {
    this.hideMenuList();
    Link.handleClick(event)
  }
  render() {
    return (
      <div className="Header index">
        <div className="Header-container">
          <div className="more">
            {this.state.showMenuList ?
              <a onClick={this.hideMenuList.bind(this)} ><i className="iconfont">&#xe642;</i></a> :
              <a onClick={this.showMenuList.bind(this)} ><i className="iconfont">&#xe61c;</i></a>
            }
          </div>
          <div className="brand">
            <a  href="/" onClick={this.handleClick.bind(this)}>
              <img src={require('./logo.png')} alt="Anker" />
            </a>
          </div>
          <div className="cart">
            <a  href="/cart" onClick={this.headCart.bind(this)}>
              <i className="iconfont">&#xe609;</i>
              <span className={'cartCount ' + (this.state.cartCount > 0 ? '' : 'hide')}></span>
            </a>
          </div>          
        </div>
        <div className= { this.state.showMenuList ? 'Header-menu show' : 'Header-menu '} >
          <ul>
            <li><a href="/category" onClick={this.handleClick.bind(this)}><i className="iconfont">&#xe643;</i>Products</a></li>
            <li><a href="/search" onClick={this.handleClick.bind(this)} ><i className="iconfont">&#xe618;</i>Search</a></li>
            <li><a href="/member" onClick={this.handleClick.bind(this)} ><i className="iconfont">&#xe607;</i>{this.state.nick_name ? ('My Account (' + this.state.nick_name + ')') : 'Account (Log in / Register)'}</a></li>
            <li><a href="/about" onClick={this.handleClick.bind(this)}><i className="iconfont" >&#xe600;</i>About Us</a></li>
            <li><a href="/contact" onClick={this.handleClick.bind(this)}><i className="iconfont" >&#xe603;</i>Contact Us</a></li>
            <li><a href="/warranty" onClick={this.handleClick.bind(this)}><i className="iconfont" >&#xe625;</i>Warranty</a></li>
            <li><a href="/privacypolicy" onClick={this.handleClick.bind(this)}><i className="iconfont" >&#xe621;</i>Privacy Policy</a></li>
            <li><a href="/termofservice" onClick={this.handleClick.bind(this)}><i className="iconfont">&#xe62a;</i>Terms of Use</a></li>
          </ul>
        </div>
      </div>
    );
  }

}


export default Header;
