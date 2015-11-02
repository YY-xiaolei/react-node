/**
 * Created by shady on 15/6/29.
 */

import React, { PropTypes, Component } from 'react';
import styles from './ActivityPage.less';
import withStyles from '../../decorators/withStyles';
import AppActions from '../../actions/AppActions';
import Dialog from '../../utils/Dialog';
import Link from '../../utils/Link';
import Track from '../../utils/Track';

@withStyles(styles)
class ActivityPage extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired
  };
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  componentWillMount() {
    if(this.props.data && this.props.data.products) {
      this.props.data.products.map(function(item) {
        item.quantity = 1;
      });
    }
    this.setState({
      'data': this.props.data
    });
  }

  componentDidMount() {
    this.state.data.detail = this.props.data.detail.replace(/\r\n/g, '<br>');
    this.setState(this.state)
    Track.ecAddImpression(this.state.data, 'Activity');
  }

  quantitySet(type, i) {
    let quant = this.state.data.products[i].quantity;
    if((type === 'reduce' && quant == 1) || (type === 'add' && quant == 999)) {
      return;
    }
    if(type === 'reduce') {
      quant = quant > 1 ? --quant : 1;
    } else if(type === 'add') {
      ++quant;
    } else {
      quant = !event.target.value ? 1 : event.target.value;
    }
    if(type === 'set' && quant == 0){
      quant = 1;
    }
    this.state.data.products[i].quantity = quant;
    this.setState(this.state);
  }

  quantityInput(i) {
    this.state.data.products[i].quantity = /^[0-9]{0,3}$/.test(event.target.value) ? event.target.value : this.state.data.products[i].quantity;
    this.setState(this.state);
  }

  variantSet(i, j) {
    this.state.data.products[i].variant = j;
    this.setState(this.state);
  }

  addCart(i) {
    event.preventDefault();
    let item = this.state.data.products[i],p = this;
    let body = {
      'line_item': {
        'variant_id': item.variants[item.variant].id,
        'quantity': item.quantity
      }
    };
    if(AppActions.getUser().order_id){
      body['order_id'] = AppActions.getUser().order_id;
    }
    fbq('track', 'AddToCart');
    AppActions.postData(
      'POST',
      '/api/orders/populate',
      (json) => {
        if(!!json.token && !!json.number) {
          AppActions.visitor(json);
          Dialog.showSuccess('Added to cart');
          p.props.cartCallback(json.line_items.length);

          const prod = Track.formatProdItem(item, item.variant, item.quantity);
          Track.ecAddToCart(prod, 'Activity');
        } else {
          Dialog.showWarning(json);
        }
      }, body
    );
  }
  handleClick(i, e){
    e.preventDefault();
    Track.ecProdClick(this.state.data.products[i], 'Activity');
    Link.handleClick(e);
  }
  share(){
     FB.ui(
     {
      method: 'share',
      href: location.href,
    }, function(response){});
  };
  render() {
    let title = 'Activity';
    this.context.onSetTitle(title);
    return (
      <div className="ActivityPage">
        <div className="ActivityPage-container">

          <div className="intro">
            <div className="banner">
              <img src={this.state.data.share_image ?  this.state.data.share_image.large_url : ''} />
            </div>
            <div className="text">
              <h3>{this.state.data.title}</h3>
              <p dangerouslySetInnerHTML={{__html: this.state.data.detail}} />
            </div>
          </div>
          <div className="share">
              <i className="iconfont" onClick={this.share.bind(this)}>&#xe60f;</i>
          </div>
          <div className="prod-list">
            {this.state.data.products ? this.state.data.products.map(function(item, i) {
              item.variant = item.variant ? item.variant : 0;
              if(item.variants.length <= 0) {
                return (
                  <div className="content-empty">Empty</div>
                );
              } else {
                return (
                  <div className="prod-item">
                    <div className="prod-item-info">

                      <a href={"/productpage?id=" + item.id} className='prod-item-info-pic' onClick={this.handleClick.bind(this, i)}>
                        {(item.variants[item.variant].is_backorderable || item.variants[item.variant].total_on_hand > 0) ? '' : <div className="available"> Not Available </div>}
                        <img src={item.variants[item.variant].images.length > 0 ? item.variants[item.variant].images[0].large_url : ''} />
                      </a>
                      <div className="prod-item-info-text">
                        <a className="title" href={'/productpage?id=' + item.id} onClick={this.handleClick.bind(this, i)}>{item.variants[item.variant].name}</a>
                        {item.variants[item.variant].display_standard_price && item.variants[item.variant].display_standard_price !== item.variants[item.variant].display_price ?
                          <div className="price">
                            <div className="price">{item.variants[item.variant].display_standard_price}</div>
                            <div className="sale">Sale : {item.variants[item.variant].display_price}</div>
                          </div> :
                          <div className="price">
                            <div className="sale">{item.variants[item.variant].display_price}</div>
                          </div>
                        }
                        <div className="attr ui-flex color">
                          {item.variants.map(function(item1, j) {
                            return (
                              <img className={item.variant === j ? 'cur' : ''} src={item1.option_values[0].image.normal_url} onClick={this.variantSet.bind(this, i, j)} />
                            );
                          }, this)}
                        </div>
                      </div>
                    </div>
                    <div className={'prod-item-twister ' + (item.variants[item.variant].is_backorderable || item.variants[item.variant].total_on_hand > 0 ? '' : 'disable')}>
                      <div className="quantity">
                        <span className="quantity-title">Quantity</span>
                        <a className={'quantity-reduce reduce' + item.quantity} onClick={this.quantitySet.bind(this, 'reduce', i)}>
                          <i className="iconfont">&#xe619;</i>
                        </a>
                        <span className="quantity-input">
                          <input type="text" value={item.quantity} onChange={this.quantityInput.bind(this, i)} onBlur={this.quantitySet.bind(this, 'set', i)} />
                        </span>
                        <a className="quantity-add" onClick={this.quantitySet.bind(this, 'add', i)}>
                          <i className="iconfont">&#xe616;</i>
                        </a>
                      </div>
                      {(item.variants[item.variant].is_backorderable || item.variants[item.variant].total_on_hand > 0) ?
                        <div className="action" onClick={this.addCart.bind(this, i)}>ADD TO CART</div> :
                        <div className="action">Not Available</div>
                      }
                    </div>
                  </div>
                );
              }
            }, this) : ''}
          </div>
        </div>
      </div>
    );
  }
}

export default ActivityPage;
