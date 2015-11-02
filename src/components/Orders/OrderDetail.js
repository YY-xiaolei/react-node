/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component} from 'react';
import AppActions from '../../actions/AppActions';
import styles from './OrderDetail.less';
import withStyles from '../../decorators/withStyles';
import Review from './Review';
import Dialog from '../../utils/Dialog';
import Verify from '../../utils/Verify';
import Track from '../../utils/Track';

@withStyles(styles)
class OrdersDetail extends Component{

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };
  componentWillMount() {
    this.setState({
      'isLoadReview': false,
      'orderDetail': this.props.data
    });
  }
  componentDidMount() {
    this.line_status = [];
    this.state.orderDetail.shipments.map(function(item){
      this.line_status.push(item.confirm_delivery ? 1 : 0);
    }, this);
    this.setState({
      email: AppActions.getUser().email
    });
    localStorage.setItem('orderTime', Verify.dateFormat(this.state.orderDetail.completed_at));
  }
   callAlert() {
    event.preventDefault();
    Dialog.confirm({'content':'Please call 1-800-988-7973 Mon-Fri 9AM-5PM (PST)'}, () => {
      location.href = "tel:1-800-988-7973";
    }, 'CANCEL')
  }
  receive(shipment_number, index) {
    var p = this;
    Dialog.confirm({
      'title': 'Receive Order',
      'content': 'Order received'
    }, () => {
      AppActions.postData(
        'PUT',
        '/api/orders/' + p.state.orderDetail.number + '/confirm_delivery',
        (json) => {
          if(json.order) {
            p.state.orderDetail.shipments[index].confirm_delivery = true;
            p.line_status[index] = 1;
            p.line_status.indexOf(0) === -1 ? p.review() : p.setState(p.state)
          } else {
            Dialog.showWarning(json);
          }
        },{his : 1, shipment_number : shipment_number}
      );
    }, 'CANCEL');
  }
  review() {
    AppActions.navigateTo('/review?his=1&number=' + this.state.orderDetail.number);
  }
  shipping(index){
    localStorage.setItem('shipping',JSON.stringify(this.state.orderDetail.shipments[index]))
     AppActions.navigateTo('/shipping?index=' + (index + 1));
  }
  paypalSubmit() {
    localStorage.setItem('order_price', this.props.data.total);
    let body = {
      'order_id': this.state.orderDetail.number,
      'order_token': AppActions.getTempOrderToken(),
      'his': 1
    };
    fbq('track', 'AddPaymentInfo');
    // console.log(this.props.data);
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
        + '&custom=' + body.order_id + ',mobile_web'
        + '&invoice=' + body.order_id;
        AppActions.loading(false);
        location.href = link;
      } else {
        Dialog.showWarning(json);
      }
    }, body);
  }
  cancelOrder(){
    Dialog.confirm({'content':'Are you sure you want to cancel this order?'},() =>{
      AppActions.postData('put','/api/orders/' + this.state.orderDetail.number + '/cancel',(json) =>{
        if(json.id){
          AppActions.navigateTo('/orders?page=1&per_page=20');
        }
      },{'his':1})
    }, 'NO', 'YES')
  }
  render() {
    let title = 'OrdersDetail';
    this.context.onSetTitle(title);
    let now = Verify.dateFormat(new Date(), 'mm-dd-yy');
    return (
      <div>
      {this.state.isLoadReview ? <Review data={this.props.data} />:
      this.state.orderDetail.bill_address ?
      <div className="OrderDetail">
        {this.state.orderDetail.state !=='canceled' ? 
        <div className="OrderDetail-toolbar">
          {this.state.orderDetail.shipments.map(function(item){
              !item.confirm_delivery ? this.reviewClass = 'hide' : ''
            }, this)
          }
          <a className={!this.state.orderDetail.paid ? '' : 'hide'}  onClick={this.paypalSubmit.bind(this)}>
            <span className="iconfont">&#xe644;</span>
            <span className="name">COMPLETE PURCHASE</span>
          </a> :

           <a className={!this.state.orderDetail.paid ? '' : 'hide'} onClick={this.cancelOrder.bind(this)}>
            <span className="iconfont">&#xe646;</span>
            <span className="name">CANCEL ORDER</span>
          </a> 
          <a className={!this.state.orderDetail.paid ? 'hide' : this.reviewClass} href={'/review?his=1&number=' + this.state.orderDetail.number}>
            <span className="iconfont">&#xe638;</span>
            <span className="name">{this.state.orderDetail.review_count === 0 ? 'WRITE' : 'CHECK'} A REVIEW</span>
          </a>
          <a className={!this.state.orderDetail.paid? 'hide' : ''} href="tel:1-800-988-7973" onClick={this.callAlert.bind(this)}>
            <span className="iconfont">&#xe603;</span>
            <span className="name">SERVICE CALL</span>
            </a>
          <a className={!this.state.orderDetail.paid? 'hide' : ''} href={'mailto:support@anker.com?subject=ANKER MOBILE SHOP RMA&body=Dear sale-team.Hello!%0d%0aThis message come from Anker Mobile Shop RMA %0d%0a%0d%0aCustomer Information%0d%0aCustomer Email:' + this.state.email + '%0d%0a%0d%0aOrder Information%0d%0aOrder No: [' + this.state.orderDetail.number + ']%0d%0a%0d%0aPayPal ID:[' + this.state.orderDetail.transaction_id  + ']%0d%0a%0d%0aCustomer Comment%0d%0a(Please according below format, fill in your exchange/return information)%0d%0a1.Exchange/Return: E/R%0d%0a2.item: name1, name2,%0d%0a3.SN(see your backage)%0d%0a4.Problem%0d%0a%0d%0aSubmit Date ' + now}>
            <span className="iconfont">&#xe62d;</span>
            <span className="name">REFUNDED OR EXCHANGEED</span>
          </a>
        </div> : ''}
        <div>
          <div className="title">{this.state.orderDetail.state ==='canceled' ? 'Order Canceled' :(!this.state.orderDetail.paid ? 'Awaiting payment' : (this.reviewClass ? 'Awaiting delivery confirmation' : (this.state.orderDetail.review_count === 0 ? 'Awaiting your feedback' : 'Complete')))}</div>
          <div className="content"><span className="orderDetail">Order ID: </span><span>{this.state.orderDetail.number} ({Verify.dateFormat(this.state.orderDetail.completed_at)})</span></div>
        </div>
        <div>
          <div className="title">Payment</div>
          <div className="otherContent orderPrice">
            <p><span>{this.state.orderDetail.total_quantity}Item(s):</span><span>{this.state.orderDetail.display_item_total}</span></p>
            <p><span>Shipping:</span><span>{this.state.orderDetail.display_ship_total}</span></p>
            <p><span>Tax:</span><span>{this.state.orderDetail.display_tax_total}</span></p>
            {
              this.state.orderDetail.adjustments.map((item, i) =>{
                return (
                  <p><span>{item.label}:</span><span>{item.amount}</span></p>
                )
              })
            }
            <p>Total: {this.state.orderDetail.display_total}</p>
          </div>
        </div>
        <div>
          <div className="title">Address</div>
          <div className="otherContent">
            <p>{this.state.orderDetail.bill_address.firstname}</p>
            <p>{this.state.orderDetail.bill_address.phone}</p>
            <p>{this.state.orderDetail.bill_address.address1} {!this.state.orderDetail.bill_address.address2 ? '' : this.state.orderDetail.bill_address.address2}</p>
            <p>{this.state.orderDetail.bill_address.city}, {this.state.orderDetail.bill_address.state.name} {this.state.orderDetail.bill_address.zipcode}</p>
            <p>USA</p>
          </div>
        </div>
        <div>
          {
            this.state.orderDetail.shipments.map(function(item, i){
              return (<div>
                <div className="package title">
                  <div>{item.tracking ? <a href="javascript:;" onClick={this.shipping.bind(this, i)}>CHECK SHIPMENT</a> : ''}</div>
                  <div className="packIndex">Order  {i + 1}{item.is_backordered ? ' (Pre-Order)' : ''}</div>
                  <div>{(item.tracking && !item.confirm_delivery) ? <a  href="javascript:;" onClick={this.receive.bind(this, item.number, i)}>CONFIRM RECEIPT</a> : ''}</div>
                </div>
                <div className="orderItem">
                  <ul>
                    {item.line_items.map(function(item) {
                      return (
                        <li>
                          <div className="itemImg"><img src={ item.variant.images[0].product_url} /></div>
                          <div className="orderInfo">
                            <div>{item.variant.name}</div>
                            <div>Price: {item.variant.display_price}</div>
                          </div>
                        </li>
                      );
                    }, this)}
                  </ul>
                </div>
                </div>
                );
            }, this)
          }
        </div>
      </div> : ''}
      </div>
    );
  }

}

export default OrdersDetail;
