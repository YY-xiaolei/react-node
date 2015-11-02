/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import styles from './App.less';

import React, { PropTypes, Component } from 'react';
import withContext from '../../decorators/withContext';
import withStyles from '../../decorators/withStyles';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import Cookie from 'react-cookie';

import Header from '../Header';
import Footer from '../Footer';

import IndexPage from '../IndexPage';
import ActivityPage from '../ActivityPage';

import LoginPage from '../Authorize/LoginPage';
import RegisterPage from '../Authorize/RegisterPage';
import ForgetPage from '../Authorize/ForgetPage';
import PasswordPage from '../Authorize/PasswordPage';

import ProductList from '../Product/ProductList';
import ProductPage from '../Product/ProductPage';
import Product60w from '../Product/Product60w';

import Category from '../Category';
import Search from '../Search';

import Cart from '../Orders/Cart';
import Delivery from '../Orders/Delivery';
import Payment from '../Orders/Payment';
import Complete from '../Orders/Complete';
import Orders from '../Orders/Orders';
import OrderAddress from '../Orders/OrderAddress';
import OrderDetail from '../Orders/OrderDetail';
import Shipping from '../Orders/Shipping';
import Review from '../Orders/Review';

import MemberPage from '../Member/MemberPage';
import ProfilePage from '../Member/ProfilePage';
import ContactPage from '../ContactPage';
import PrivacyPolicy from '../PrivacyPolicy';
import NotFoundPage from '../NotFoundPage';

import FaqPage from '../FaqPage';
import WarrantyPage from '../WarrantyPage';
import FeedBack from '../Feedback';
import About from '../AboutPage';
import Coupon from '../Coupon';
import Country from '../Country';

import Address from '../Address/Address';
import AddressAdd from '../Address/AddressAdd';

import TermOfService from '../TermOfService';

@withContext
@withStyles(styles)
class App extends Component {

  static propTypes = {
    path: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.setState({
      'email': '',
      'cartCount': 0
    });
  }

  componentWillUpdate() {
    ga('create', 'UA-68208614-1', 'auto');
  }
  componentDidUpdate() {
    let url = location.pathname + location.search;
    // ga('set', 'page', url);ga('send', 'pageview');
    ga('send', 'pageview', url);
  }
  componentDidMount() {
    AppActions.loading(false);
    Cookie.save('platform', 'mobile_web');
    this.state.cartCount = localStorage.getItem('cartCount');
    this.state.nick_name = AppActions.getUser().nick_name;
    this.setState(this.state);
    window.addEventListener('popstate', this.handlePopState);

    window.fbAsyncInit = function() {
      FB.init({
        appId      : '1495091067451264',
        xfbml      : true,
        version    : 'v2.4'
      });
    };
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return; }
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    fbq('init', '759876867455653');
    fbq('track', 'PageView');

    let url = location.pathname + location.search;
    ga('set', 'page', url);ga('send', 'pageview');
    // ga('send', 'pageview', url);
  }

  shouldComponentUpdate(nextProps) {
    this.state.nick_name = AppActions.getUser().nick_name;
    this.state.cartCount = localStorage.getItem('cartCount') || 0;
    nextProps.data = AppStore.getPage(nextProps.path);
    document.body.scrollTop = 0;
    console.info(this.props,nextProps);
    return (this.props.path !== nextProps.path || this.props.data !== nextProps.data);

    //return true;
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handlePopState);
  }

  handlePopState(event) {
    AppActions.navigateTo(window.location.pathname + decodeURI(window.location.search), {replace: !!event.state});
  }
  setCartCount(count){
    count == 0 ? document.getElementsByClassName("cartCount")[0].className ="cartCount hide" : document.getElementsByClassName("cartCount")[0].className ="cartCount ";
    this.state.cartCount = count;
    this.setState(this.state);
    localStorage.setItem("cartCount", this.state.cartCount);
  }
  render() {
    let component;
    let idx = this.props.path.indexOf('?');
    if(idx > -1) {
      this.props.path = this.props.path.slice(0, idx);
    }
    switch (this.props.path) {
      case '/':
      case '/index':
        component = <IndexPage data={this.props.data} />;
        break;
      case '/privacypolicy':
        component = <PrivacyPolicy />;
        break;
      case '/contact':
        component = <ContactPage />;
        break;
      case '/login':
        component = <LoginPage />;
        break;
      case '/register':
        component = <RegisterPage />;
        break;
      case '/forget':
        component = <ForgetPage />;
        break;
      case '/password':
        component = <PasswordPage />;
        break;
      case '/activity':
        component = <ActivityPage data={this.props.data} cartCallback={this.setCartCount.bind(this)} />;
        break;
      case '/productlist':
        component = <ProductList data={this.props.data} />;
        break;
      case '/productpage':
        component = <ProductPage data={this.props.data} cartCallback={this.setCartCount.bind(this)} />;
        break;
      case '/product60w':
        component = <Product60w cartCallback={this.setCartCount.bind(this)} />;
        break;
      case '/search':
        component = <Search data={this.props.data} />;
        break;
      case '/category':
        component = <Category data={this.props.data} />;
        break;
      case '/member':
        component = <MemberPage data={this.props.data} />;
        break;
      case '/profile':
        component = <ProfilePage data={this.props.data} />;
        break;
      case '/cart':
        component = <Cart data={this.props.data} cartCallback={this.setCartCount.bind(this)} />;
        break;
      case '/addressadd':
        component = <AddressAdd />;
        break;
      case '/addressedit':
        component = <AddressAdd data={this.props.data} />;
        break;
      case '/orderaddress':
        component = <OrderAddress data={this.props.data} />;
        break;
      case '/delivery':
        component = <Delivery data={this.props.data} />;
        break;
      case '/payment':
        component = <Payment data={this.props.data} />;
        break;
      case '/complete':
        component = <Complete data={this.props.data} />;
        break;
      case '/faq':
        component = <FaqPage/>;
        break;
      case '/warranty':
        component = <WarrantyPage/>;
        break;
      case '/feedback':
        component = <FeedBack data={this.props.data}/>;
        break;
      case '/about':
        component = <About/>;
        break;
      case '/country':
        component = <Country/>;
        break;
      case '/address':
        component = <Address data={this.props.data}/>;
        break;
      case '/orders':
        component = <Orders data={this.props.data}/>;
        break;
      case '/orderdetail':
        component = <OrderDetail data={this.props.data} />;
        break;
      case '/shipping':
        component = <Shipping />;
        break;
      case '/review':
        component = <Review data={this.props.data} />;
        break;
      case '/termofservice':
        component = <TermOfService />;
        break;
      case '/coupon':
        component = <Coupon data={this.props.data} />;
        break;
      default:
        component = <NotFoundPage />;
        break;
    }

        // <GAInitializer />
    return (
      <div id="container">
        <Header nick_name={this.state.nick_name} cartCount={this.state.cartCount} />
        {component}
        <Footer />
      </div>
    );
  }

}

export default App;
