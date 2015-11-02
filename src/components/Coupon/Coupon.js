import React, { PropTypes, Component} from 'react';
import AppActions from '../../actions/AppActions';
import styles from './Coupon.less';
import withStyles from '../../decorators/withStyles';
import Dialog from '../../utils/Dialog';
import Verify from '../../utils/Verify';

@withStyles(styles)
class Coupon extends Component {
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };
  componentWillMount() {
    this.setState({
      'coupons': this.props.data.coupons || [],
      'coupon_code': ''
    });
  }
  componentDidMount() {
    if(!AppActions.getUser().token) {
      AppActions.navigateTo('/login');
    }
  }
  render() {
    let title = 'Coupon';
    this.context.onSetTitle(title);
    return (
      <div className="Coupon">
        <div className="Coupon-container">
          <div className="code">
            <input type="text" value={this.state.coupon_code} placeholder="Promo Code" onChange={this.setValue.bind(this)} />
          </div>
          <div className="submit"><a onClick={this.submit.bind(this)}>SUBMIT</a></div>
        </div>
        <div className="mycoupon">My Rewards</div>
        <div>
          <ul className="coupon-list cell-12">
            {this.state.coupons.length > 0 ? this.state.coupons.map(function(item){
              return (
                <li className="coupon ui-flex" >
                  <div className="coupon-left cell-3">
                    <div>{item.display_promotion}</div>
                    <div>{item.display_state}</div>
                  </div>
                  <div className="coupon-right cell-9">
                    <div>Name: {item.name}</div>
                    <div>Date: {Verify.dateFormat(item.starts_at)} ~ {Verify.dateFormat(item.expires_at)}</div>
                    <div>Comment: {item.description}</div>
                  </div>
                </li>
              );
            }, this) : ''}
            </ul>
        </div>
      </div>
    );
  }
  setValue(){
    this.setState({
      'coupon_code': event.target.value
    });
  }
  todate(date){
    var d = new Date(date), day=d.getDate(), month = d.getMonth() + 1, year = d.getFullYear();
    return (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day) + '-' + year ;
  }
  getList(){
    AppActions.getData(
      'get',
      '/api/promotions/coupons',
      (json) => {
        if(json.coupons){
          this.setState({
            coupons: json.coupons,
            coupon_code: ''
          });
        } else {
          Dialog.showWarning(json);
        }
      }
    );
  }
  submit(){
    if(!this.state.coupon_code){
      Dialog.showWarning('Please enter a valid promo code');
      return;
    }
    AppActions.postData(
      'POST',
      '/api/promotions/bind_coupon',
      (json) => {
        if(json.code) {
          Dialog.showSuccess('Promo code added');
          this.state.coupon_code = '';
          this.getList();
        } else {
          Dialog.showWarning(json);
        }
      },
      {'coupon_code': this.state.coupon_code}
    );
  }
}

export default Coupon;
