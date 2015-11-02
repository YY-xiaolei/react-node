import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './Action.less';
import Dialog from '../../utils/Dialog';
import AppActions from '../../actions/AppActions';
import Track from '../../utils/Track';

@withStyles(styles)
class Action extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired,
    step: PropTypes.number.isRequired,
    checkout: PropTypes.func,
    checkout1: PropTypes.func,
    link: PropTypes.string
  };
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };
  paypalSubmit(event) {
    localStorage.setItem('order_price', this.props.data.total);
    let body = {
      'order_id': AppActions.getUser().order_id,
      'order_token': AppActions.getUser().order_token
    };
    if(!body.order_token){
        AppActions.navigateTo('/orders');
        return;
    }
    fbq('track', 'AddPaymentInfo');
    // localStorage.setItem('order_price', this.props.data.total);
    Track.saveEcPurchase(this.props.data.line_items, {
      'id': this.props.data.number,
      'revenue': this.props.data.total,
      'shipping': this.props.data.shipment_total,
      'tax': this.props.data.tax_total,
    });
    AppActions.postData('post', '/api/payments/paypal_create_button', (json) => {
      if(json.result === 'success') {
        let paypal = decodeURIComponent(json.content);
        let link = paypal.slice(paypal.indexOf('EMAILLINK=')).replace('EMAILLINK=', '')
        + '&custom=' + AppActions.getUser().order_id + ',mobile_web'
        + '&invoice=' + AppActions.getUser().order_id;
        AppActions.loading(true);
        AppActions.removeOrder();
        location.href = link;
      } else {
        Dialog.showWarning(json);
      }
    }, body);
  }

  render() {
    return (
      <div className="order-action ui-flex">
        <div className="cart-count cell-6">
          <div className="orderPrice">
            <div><span>{this.props.data.total_quantity}Item(s):</span><span>${this.props.data.item_total}</span></div>
            <div><span>Shipping:</span><span>${this.props.data.ship_total}</span></div>
            <div><span>Tax:</span><span>${this.props.data.tax_total}</span></div>
            {
              this.props.data.adjustments.map((item, i) =>{
                return (
                  <div ><span>{item.label}:</span><span>{item.amount}</span></div>
                )
              })
            }
            <div><span>Total:</span><span>${this.props.data.total}</span></div>
          </div>
        </div>
        <div className="cart-checkout cell-6">
        {this.props.step === 4 ?
          <div className="multi-btn">
            <a className="circle active" onClick={this.paypalSubmit.bind(this)}>
              <img src={require('../../public/paypal.png')} alt="PAYBYPAYPAL" />
              <span>Pay with PayPal</span>
            </a>
          </div>
          :
          <a className="square" onClick={this.props.checkout}>{this.props.step === 1 ? 'CHECKOUT' : 'PROCEED'}</a>}
        </div>
        <div className="cart-step cell-12">
          <ul className={'step' + this.props.step }>
            <li>
              <i>1</i>
              <span>Cart</span>
            </li>
            <li>
              <i>2</i>
              <span>Address</span>
            </li>
            <li>
              <i>3</i>
              <span>Delivery</span>
            </li>
            <li>
              <i>4</i>
              <span>Payment</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Action;
