/**
 * Created by shady on 15/6/29.
 */

import React, { PropTypes, Component } from 'react';
import styles from './Product60w.less';
import withStyles from '../../decorators/withStyles';
import AppActions from '../../actions/AppActions';
import Dialog from '../../utils/Dialog';
import Track from '../../utils/Track';

@withStyles(styles)
class Product60w extends Component {
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  componentDidMount() {
    Track.ecAddImpression({products: [{
      sku: 'A2123122',
      name: 'PowerPort 6 60W Desktop Charger',
      category: 'PowerPort/PowerPort',
      price: '79.9',
    }]}, 'Product60w');
  }

  headCart() {
    AppActions.navigateTo(AppActions.getUser().token ? '/cart' : '/cart?order_id=' + AppActions.getUser().order_id);
  }

  populate60w() {
    event.preventDefault();
    let body = {line_item: { variant_id: 1649, quantity: 1 }};
    if(AppActions.getUser().order_id) {
      body['order_id'] = AppActions.getUser().order_id;
    }
    fbq('track', 'AddToCart');
    AppActions.postData(
      'POST',
      '/api/orders/populate',
      (json) => {
        AppActions.loading(false);
        if(!!json.token && !!json.number) {
          AppActions.visitor(json);
          Dialog.confirm(
            {'content': 'Added to cart'},
            () => {
              this.headCart();
            },
            'Continue Shopping',
            'Go to Cart'
          );
          this.props.cartCallback(json.line_items.length);

          Track.ecAddToCart({
            id: 'A2123122', // this.props.data.id
            name: 'PowerPort 6 60W Desktop Charger',
            category: 'PowerPort/PowerPort',
            variant: 'Black',
            price: '79.9',
            quantity: 1,
          }, 'Product60w');
        } else {
          Dialog.showWarning(json);
        }
      },
      body
    );
  };
  render() {
    let title = 'PowerPort 6 60w';
    this.context.onSetTitle(title);
    return (
      <div className="Product">
        <div className="deals-head">
          <img src="http://s3-us-west-2.amazonaws.com/m-anker-com/60w2/image_0.jpg" />
          <div className="deals-head-fixed">
            <div className="deals-head-wrap">
              <img src="http://s3-us-west-2.amazonaws.com/m-anker-com/60w2/image_00.jpg" />
              <a className="cart" onClick={this.populate60w.bind(this)}></a>
            </div>
          </div>
        </div>
        <div className="deals-wrapper">
          <img src="http://s3-us-west-2.amazonaws.com/m-anker-com/60w2/image_01.jpg" />
          <img src="http://s3-us-west-2.amazonaws.com/m-anker-com/60w2/image_02.jpg" />
          <img src="http://s3-us-west-2.amazonaws.com/m-anker-com/60w2/image_03.jpg" />
        </div>
      </div>
    );
  }
}

export default Product60w;
