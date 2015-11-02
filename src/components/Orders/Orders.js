
/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component} from 'react';
import AppActions from '../../actions/AppActions';
import styles from './Orders.less';
import withStyles from '../../decorators/withStyles';

@withStyles(styles)
class Orders extends Component{

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };
  componentWillMount() {
    this.setState({
      'screenH':'350px',
      'orders':this.props.data.orders || []
    });
  }
  componentDidMount() {
    this.setState({
      'screenH': screen.height * .73 + 'px'
    });
    console.info( this.state.orders);
  }
  goOderDetail(number, token){
    AppActions.tempOrderToken(token);
    AppActions.navigateTo('/orderdetail?number=' + number+"&his=1");
  }
  reload(){
    location.reload();
  }
  go(){
    AppActions.getData('get','/api/orders/history_order?page=' + (parseInt(this.props.data.current_page) + 1) + '&per_page=20', (json) => {
      this.state.orders = this.state.orders.concat(json.orders)
      this.props.data.current_page = json.current_page;
      this.setState(this.state);
    });
  }
  render() {
    let title = 'Orders';
    this.context.onSetTitle(title);
    return (
    <div className="Orders">
    {this.state.orders.length>0 ?
      <div><ul>
      {
        this.state.orders.map(function(item){
          return (
            <li onClick={this.goOderDetail.bind(this, item.number, item.token)}>
              <div className="Orders-status">{ item.state === 'canceled' ? 'Order Canceled' : (!item.paid ? 'Awaiting payment' : (!item.take_delivery ? 'Awaiting delivery confirmation' : (item.review_count === 0 ? 'Awaiting your feedback' :'Complete')))}: {item.number}</div>
              <div className="orderList">
                {
                  item.line_items.map((imgItem, i) => {
                    return (
                      (i < 4 ? <img src={ imgItem.variant.images[0].product_url} /> : '')
                    )
                  })
                }   
              </div>
              <div className="Orders-detail" > 
                <div>{item.total_quantity + ' Item(s): ' + item.display_item_total}</div>
                <div><span>Shipping: {item.display_ship_total}</span><span className="total">TOTAL</span></div>
                <div>Tax: {item.display_tax_total} <span className="total">{item.display_total}</span></div>
                <div>Promotion: -${item.display_discount_total}</div>
              </div>
            </li>
          );
        }, this)
      }
      </ul>
      {
        this.props.data.pages > parseInt(this.props.data.current_page) ? <div className="more"><i className="iconfont" onClick={this.go.bind(this)}>&#xe645;</i></div> : ''
      }
      </div>
      :<div className="noData" style={{'minHeight': this.state.screenH}}>
        <div>
          <i className="iconfont" onClick={this.reload.bind(this)}>&#xe63c;</i>
          <p>You haven’t placed any orders yet.</p>
        </div>
      </div>
    } 
    </div>
    );
  }
}
export default Orders;

