import React, { PropTypes, Component} from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './Payment.less';
import Action from './Action';
import AppActions from '../../actions/AppActions';
import Dialog from '../../utils/Dialog';
import Coupon from './OrderCoupon';
import Verify from '../../utils/Verify';
import Link from '../../utils/Link';

@withStyles(styles)
class Payment extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired
  };
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.setState({
      'data': this.props.data,
      'credit': {
        'number': '',
        'date': '',
        'verification_value': ''
      },
    });
  }
  componentDidMount() {
    console.info(this.props.data);
    var item = [];
    for(var i = 0, j = this.props.data.line_items;i < j;i++){
      item.push({
        "id": this.props.data.line_items[i].id,
        "price": this.props.data.line_items[i].price,
        "quantity": this.props.data.line_items[i].quantity
      })
    }
    window.criteo_q = window.criteo_q || [];
    window.criteo_q.push( 
      { event: "setAccount", account: 22904 },
      { event: "setHashedEmail", email:  this.props.data.email},
      { event: "set SiteType", type: "mobile" },
      { event: "trackTransaction" , id: AppActions.getUser().order_id, item:item});
  }
  setData(json) {
    this.props.data = json;
    this.setState(this.state);
  };

  render() {
    let title = 'Payment';
    this.context.onSetTitle(title);
    if(!this.state.data) return (
      <div className="emptyCart">
        <i className="iconfont">&#xe62e;</i>
        <section className="info">
          <p className="text1">Cart Empty T.T</p>
          <p className="text2">Let's Go shopping Now!</p>
          <p className="url">
            <a href="/" onClick={Link.handleClick}>Go Shopping</a>
          </p>
        </section>
      </div>
    );
    return (
      <div className="Payment">
        <div className="Payment-container">

          <div className="title">
            <p>If you have a promo code,</p>
            <p>please use it here</p>
          </div>
          <Coupon data={this.state.data} setData={this.setData.bind(this)} />

          <div className="order-space">
            <img src={require("../../public/car.png")} />
          </div>

          {this.state.data.line_items ?
            <Action data={this.state.data} step={4} />
            : ''}

        </div>
      </div>
    );
  }
}

export default Payment;
