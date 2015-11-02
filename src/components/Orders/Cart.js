/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './Cart.less';
import Action from './Action';
import AppActions from '../../actions/AppActions';
import Link from '../../utils/Link';
import OrderLogin from './OrderLogin';
import Dialog from '../../utils/Dialog';
import Track from '../../utils/Track';

@withStyles(styles)
class Cart extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired
  };
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };
  cartList = [];
  componentWillMount() {
    this.setState({
      'data': this.props.data,
      'show': 'cart',
      'email': '',
      'password': ''
    });
  };
  componentDidMount() {
    var carCount = this.props.data ? this.props.data.line_items.length : 0;
    this.props.cartCallback(carCount);
    window.criteo_q = window.criteo_q || [];
    window.criteo_q.push(
      { event: 'setAccount', account: 22904 },
      { event: 'setHashedEmail', email: AppActions.getUser().invitation_code },
      { event: 'setSiteType', type: "mobile" },
      { event: 'viewBasket', item: this.cartList}
    );
  }
  address() {
    if(AppActions.getUser().token) {
      let body = {
        'id': AppActions.getUser().order_id,
        'state': 'cart'
      };
      fbq('track', 'InitiateCheckout');
      /*ga('ecommerce:addTransaction', {
        'id': this.props.data.number,                   // Transaction ID. Required.
        'affiliation': 'Anker Store',                   // Affiliation or store name.
        'revenue': this.props.data.total,               // Grand Total.
        'shipping': '1',                                // Shipping.
        'tax': this.props.data.tax_total                // Tax.
      });*/
      AppActions.postData(
        'PUT',
        '/api/checkouts/' + AppActions.getUser().order_id,
        (json) => {
          this.setState({
            'show':'cart'
          });
          // console.log(this.state.data, json);
          if(json.state === 'address') {
            Track.ecCheckout(json.line_items, 1);
            AppActions.navigateTo('/orderaddress');
          } else {
            Dialog.showWarning(json)
          }
        },
        body
      );
    } else {
      this.setState({
        show: 'login'
      })
    }
  };

  quantitySet(itemid, type, i) {
    event.preventDefault();
    let quant = !this.state.data.line_items[i].quantity ? 1 : this.state.data.line_items[i].quantity;
    if((type === 'reduce' && quant == 1) || (type === 'add' && quant == 999)) {
      return;
    }
    quant = type === 'reduce' ? (quant > 1 ? --quant : 1) : type === 'add' ? ++quant : !event.target.value ? 1 : event.target.value;
    if(type === 'set' && quant == 0){
      quant = 1;
    }
    let body = {'line_item': { 'variant_id': itemid, 'quantity': quant }};
    AppActions.postData('PUT', '/api/orders/' + AppActions.getUser().order_id + '/line_items/' + itemid,
      (json) => {
        if(json.error || json.exception) {
          Dialog.showWarning(json);
        } else {
          this.setState({
            data: json
          });
        }
      }, body);
  };
  quantityInput(i) {
    this.state.data.line_items[i].quantity = /^[0-9]{0,3}$/.test(event.target.value) ?  event.target.value : this.state.data.line_items[i].quantity;
    this.setState(this.state);
  }
  variantDel(itemid, i) {
    event.preventDefault();
    var p = this;
    Dialog.confirm({
      'title': 'Remove Item',
      'content': 'Are you sure you want to remove this item from your cart?'
    }, () => {
      AppActions.postData('DELETE', '/api/orders/' + AppActions.getUser().order_id + '/line_items/' + itemid,
        (json) => {
          if(json.error || json.exception) {
            Dialog.showWarning(json);
          } else {
            const prod = this.state.data.line_items[i];
            Track.ecRemoveFromCart(prod, 'Cart');
            p.setState({
              data: json
            });
            p.props.cartCallback(json.line_items.length);
          }
        }
      );
    }, 'CANCEL')
  };
  render() {
    let title = 'Cart';
    this.context.onSetTitle(title);
    if(!this.state.data || !this.state.data.line_items || !this.state.data.line_items.length) {
      return (
        <div className="emptyCart">
          <i className="iconfont">&#xe62e;</i>
          <section className="info">
            <p className="text1">Cart Empty</p>
            <p className="text2">You currently have no items in your cart</p>
            <p className="url">
              <a href="/" onClick={Link.handleClick}>SHOP NOW</a>
            </p>
          </section>
        </div>
      )
    }
    return (
      <div className="CartPage">
        <div className="CartPage-container">

          <OrderLogin show={this.state.show} address={this.address.bind(this)} />

          <div className={"cart-items " + this.state.show}>
            <ul className="cart-ul">
              {this.state.data.line_items.map(function(item, i) {
                this.cartList.push({ id: item.id, price: item.variant.price, quantity: item.quantity })
                return (
                  <li className="cart-li">
                    <div className="cart-items-img">
                      <img src={ item.variant.images[0].product_url} />
                    </div>
                    <div className="cart-items-info">
                      <div className="title">{item.variant.name}</div>
                      <div className="price">Price : ${item.variant.price}</div>
                      <div className="info-act">
                        <div className="quantity">
                          <a className={'quantity-reduce reduce' + item.quantity} onClick={this.quantitySet.bind(this, item.id, 'reduce', i)} >
                            <i className="iconfont">&#xe619;</i>
                          </a>
                          <input type="text" value={item.quantity} onChange={this.quantityInput.bind(this, i)} className="quantity-input" onBlur={this.quantitySet.bind(this, item.id, 'set', i)} />
                          <a className="quantity-add" onClick={this.quantitySet.bind(this, item.id, 'add', i)} ><i className="iconfont">&#xe616;</i></a>
                        </div>
                        <a className="remove" onClick={this.variantDel.bind(this, item.id, i)}>Remove</a>
                      </div>
                    </div>
                  </li>
                );
              }, this)}
            </ul>
            <div className="order-space">
              <img src={require("../../public/car.png")} />
            </div>

            {this.state.data.line_items ?
              <Action data={this.state.data} checkout={this.address.bind(this)} step={1} />
              : ''}
          </div>
      </div>
    </div>
    );
  }
}

export default Cart;
