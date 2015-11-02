/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, {Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './OrderCoupon.less';
import AppActions from '../../actions/AppActions';
import Dialog from '../../utils/Dialog';

@withStyles(styles)
class Coupon extends Component {

  componentWillMount() {
    this.setState({
      'data': this.props.data,
      'coupons': '',
      'couponcode': ''
    });
  }

  componentDidMount() {
    this.ava_coupons();
  }

  ava_coupons() {
    AppActions.getData('GET', '/api/promotions/available_coupons', (json) => {
      if(json.coupons) {
        this.setState({
          'coupons': json.coupons
        });
      }
    });
  }

  couponSet(type) {
    if(!AppActions.getUser().order_token){
       AppActions.navigateTo('/orders');
       return;
    }
    if(type !== 'del' && !this.state.couponcode) {
      Dialog.showWarning('Please enter a valid promo code');
    } else {
      let body = { 'coupon_code': type === 'del' ? this.state.data.applied_coupon.code : this.state.couponcode };
      AppActions.postData('PUT', '/api/orders/' + AppActions.getUser().order_id + (type === 'del' ? '/remove_coupon_code' : '/apply_coupon_code'), (json) => {
        if(json.error || json.exception) {
          Dialog.showWarning(json);
        } else {
          this.props.setData(json);
          this.setState({
            data: json,
            couponcode: type === 'del' ? '' : this.state.couponcode
          });
          if(type === 'del') {
            this.ava_coupons();
            Dialog.showSuccess('Promo code removed');
          } else {
            Dialog.showSuccess('Promo code added');
          }
          location.href = location.href;
        }
      }, body);
    }
  };

  couponInput(event) {
    this.setState({
      'couponcode': event.currentTarget.value
    });
  }

  couponSelect(code) {
    this.state.couponcode = code;
    this.couponSet('set');
  }

  render() {
    return (
      <div className="Coupon">
        {this.state.data.applied_coupon ?
          <div className="usedCoupon">
            <div>
              <span>COUPON CODE:{this.state.data.applied_coupon.code}</span>
            </div>
            <div>
                <a className="remove" onClick={this.couponSet.bind(this, 'del')}>REMOVE</a>
            </div>
          </div>
          :
          <div>
            <div className='coupon-input'>
              <input placeholder="Promo Code" onChange={this.couponInput.bind(this)} value={this.state.data.couponcode} />
            </div>
            <div className='coupon-input'><a className="submit" onClick={this.couponSet.bind(this, 'set')}>SUBMIT</a></div>
            <ul className="coupon-list cell-12">
              {this.state.coupons ? this.state.coupons.map(function(item){
                let start = item.starts_at.substring(0, 10);
                let expire = item.expires_at.substring(0, 10);
                return (
                  <li className="coupon ui-flex" onClick={this.couponSelect.bind(this, item.code)}>
                    <div className="coupon-left cell-3">
                      <div>{item.display_promotion}</div>
                    </div>
                    <div className="coupon-right cell-9">
                      <div>Name: {item.name}</div>
                      <div>Date: {start} ~ {expire}</div>
                      <div>Comment: {item.description}</div>
                    </div>
                  </li>
                );
              }, this) : ''}
            </ul>
          </div>
        }
      </div>
    );
  }

}
export default Coupon;
