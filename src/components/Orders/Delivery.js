import React, { PropTypes, Component} from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './Delivery.less';
import Action from './Action';
import AppActions from '../../actions/AppActions';
import Dialog from '../../utils/Dialog';
import Link from '../../utils/Link';
import Track from '../../utils/Track';

@withStyles(styles)
class Delivery extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired
  };
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  payment() {
    let body = {
      'token': AppActions.getUser().token,
      'order_token': AppActions.getUser().order_token,
      'id': AppActions.getUser().order_id,
      'state': 'delivery'
    };
    AppActions.postData(
      'PUT',
      '/api/checkouts/' + AppActions.getUser().order_id,
      (json) => {
        if(json.state === 'payment') {
          Track.ecShippingComplete(3);
          AppActions.navigateTo('/payment');
        } else {
          Dialog.showWarning(json);
        }
      },
      body
    );
  };

  render() {
    let title = 'Delivery';
    this.context.onSetTitle(title);
    let lineitems = {};
    if(!this.props.data) return (
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
    if(this.props.data.line_items) {
      this.props.data.line_items.map(function(item) {
        lineitems[item.variant_id] = item;
      });
    }
    return (
      <div className="Delivery">
        <div className="Delivery-container">

          <div className="package-list">
            <ul>
              {this.props.data.shipments ? this.props.data.shipments.map(function(item, i) {
                let myQuantity = 0;
                if(item.manifest) {
                  item.manifest.map(function(item1) {
                    myQuantity += item1.quantity;
                  });
                }
                return (
                  <li className="ui-flex">
                    <div className="count cell-5">
                      <div>Order {i + 1}</div>
                      <div>{myQuantity} Item(s)</div>
                    </div>
                    <div className="pics cell-7">
                      {item.manifest ? item.manifest.map(function(item1) {
                        return (
                          <span><img src={lineitems[item1.variant_id].variant.images[0].large_url} /></span>
                        );
                      }) : ''}
                    </div>
                    {item.shipping_rates.map(function(item1) {
                      return (
                        <div className="shipment cell-12">
                          {item1.selected ? <i className="iconfont">&#xe632;</i> : <i className="iconfont">&#xe634;</i>}
                          {item1.name} ({'$' + item1.cost})
                        </div>
                      );
                    }, this)}
                  </li>
                );
              }, this) : ''}
            </ul>
          </div>

          <div className="order-space">
            <img src={require("../../public/car.png")} />
          </div>

          {this.props.data.line_items ?
            <Action data={this.props.data} checkout={this.payment.bind(this)} step={3} />
            : ''}

        </div>
      </div>
    );
  }
}

export default Delivery;
