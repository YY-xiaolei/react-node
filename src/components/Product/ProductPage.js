/**
 * Created by shady on 15/6/29.
 */

import React, { PropTypes, Component } from 'react';
import styles from './Product.less';
import withStyles from '../../decorators/withStyles';
import ReactSwipe from '../../utils/react-swipe';
import classnames from 'classnames';
import AppActions from '../../actions/AppActions';
import Dialog from '../../utils/Dialog';
import Verify from '../../utils/Verify';
import Track from '../../utils/Track';


@withStyles(styles)
class ProductPage extends Component {

  static propTypes = {
    cur: PropTypes.number,
    data: PropTypes.array.isRequired
  };
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
    onSetMeta: PropTypes.func.isRequired
  };

  componentWillMount() {
    let index = 0 ;
    if(this.props.data.variants && typeof(window) === "object"){
      let sku = AppActions.getUrlParam().sku;
      if(sku){
        for(var j = 0, z = this.props.data.variants.length; j < z; j++){
          if(this.props.data.variants[j].sku === sku){
            index = j;
            break;
          }
        }
      }
    }
    this.setState({
      'cur': 0,
      'tab': 1,
      'variant': index,
      'quantity': 1,
      'variant_id': (this.props.data.variants && this.props.data.variants.length > 0) ? this.props.data.variants[0].id : '',
      'review': {
        'reviews': [],
        'stars':[]
      }
    });

  }

  componentDidMount() {
    this.loadReview(1);
    window.criteo_q = window.criteo_q || [];
    window.criteo_q.push(  
      { event: 'setAccount', account: 22904 },
      { event: 'setHashedEmail', email: AppActions.getUser().invitation_code },
      { event: 'setSiteType', type: 'mobile' },
      { event: 'viewItem', item: this.props.data.id });
    fbq('track', 'ViewContent');
    Track.ecAddImpression({products: [this.props.data]}, 'Product');
    const prod = Track.formatProdItem(this.props.data, this.state.variant, this.state.quantity);
    Track.ecViewDetail(prod);
  }

  prodTab(i) {
    this.setState({
      tab: i
    });
    document.body.scrollTop = 0;
  }

  swipeClick(i) {
    this.refs.Carousel.swipe.slide(i);
  }

  swipeCallback(i) {
    this.setState({
      cur: i
    });
  };

  quantitySet(num) {
    if (num === 'reduce') {
      this.state.quantity = this.state.quantity > 1 ? this.state.quantity - 1 : 1;
    } else if(num === 'add') {
      if(this.state.quantity == 999){
        return;
      }
      this.state.quantity++;
    } else {
      this.state.quantity = (!event.target.value || event.target.value == 0) ? 1 : event.target.value;
    }

    this.setState({
      quantity: this.state.quantity
    });
  }

  quantityInput(i) {
    this.state.quantity = /^[0-9]{0,3}$/.test(event.target.value) ? event.target.value : this.state.quantity;
    this.setState(this.state);
  }

  variantSet(variant, id) {
    this.setState({
      'variant': variant,
      'variant_id': id
    });
    const prod = Track.formatProdItem(this.props.data, variant);
    Track.ecViewDetail(prod);
  }

  headCart() {
    AppActions.navigateTo(AppActions.getUser().token ? '/cart' : '/cart?order_id=' + AppActions.getUser().order_id);
  }

  addCart(event) {
    event.preventDefault();
    let body = {
      'line_item': {
        'variant_id': this.state.variant_id,
        'quantity': this.state.quantity
      }
    }, p = this;
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
          p.props.cartCallback(json.line_items.length);

          const prod = Track.formatProdItem(this.props.data, this.state.variant);
          Track.ecAddToCart(prod, 'Product');
        } else {
          Dialog.showWarning(json);
        }
      },
      body
    );
  };
  share(){
     FB.ui(
     {
      method: 'share',
      href: location.href,
    }, function(response){});
  };
  go(){
    this.loadReview(this.state.review.current_page + 1);
  }
  loadReview(index){
    AppActions.getData('get','/api/products/' + this.props.data.id + '/reviews?page=' + index + '&per_page=20', (json) => {
      if(json.star) {
        json.stars = [];
        for (var i = 1; i <= 5; i++) {
          json.stars.push(i <= json.star ? 100 : parseInt((json.star - i + 1) * 100));
        };
      } else {
        json.stars = [0,0,0,0,0];
      }
      this.state.review.reviews = this.state.review.reviews.concat(json.reviews);
      this.state.review.current_page = json.current_page;
      this.state.review.pages = json.pages;
      this.state.review.star = json.star;
      console.info(this.state.review.star);
      this.setState(this.state);
    });
  }
  render() {
    let title = 'Product';
    this.context.onSetTitle(title);
    
    let prod = this.props.data.variants ? this.props.data.variants[this.state.variant] : '';
    let content = this.props.data.content;
    return (
      <div className="Product">
        <div className="Product-container">

          <div className="product-nav">
            <ul className={'tabs' + this.state.tab}>
              <li onClick={this.prodTab.bind(this, 1)}><span>Overview</span></li>
              <li onClick={this.prodTab.bind(this, 2)}><span>Details</span></li>
              <li onClick={this.prodTab.bind(this, 3)}><span>Reviews</span></li>
            </ul>
          </div>

          { prod ?
            <ul className={"prod-viewport viewport" + this.state.tab}>
              <li className="Overview">
                <div className="Carousel">
                  {prod.is_backorderable || prod.total_on_hand > 0 ? '' : <div className="available"> Not  Available </div>}
                  <div className="share" style = {{'display':'none'}}><i className="iconfont" onClick={this.share.bind(this)}>&#xe60f;</i></div>
                  {prod.images.length > 0 ?
                    <ReactSwipe className="carousel-img" ref="Carousel" shouldUpdate={
                      function(nextProps) {
                        return 1;
                      }
                    } callback={this.swipeCallback.bind(this)}>
                      {prod.images.map(function(item) {
                        return (
                          <img src={ item.large_url} />
                        );
                      }, this)}
                    </ReactSwipe> : ''
                  }
                  <div className="carousel-ctrl">
                    <ol>
                      {prod.images.length > 0  ? prod.images.map(function(item, i) {
                        return (
                          <li key={i} className={i === this.state.cur ? 'cur' : ''} onClick={this.swipeClick.bind(this, i)}>
                            <a>{i}</a>
                          </li>
                        );
                      }, this) : '' }
                    </ol>
                  </div>
                </div>
                <div className="Overview-text">
                  <div className="title">{this.props.data.name}</div>
                  <div className="description" dangerouslySetInnerHTML={{__html: this.props.data.description.replace(/\r\n/g, '<br>')}} />
                  {prod.tag ? <div className="tag">
                  {
                    prod.tag.split(',').map(function(item, i){
                      return (
                          <span>{item}</span>
                        )
                    })
                  }
                  </div> : ''}
                  {(prod.display_standard_price && prod.display_standard_price !== prod.display_price) ?
                    <div className="price">
                      <span className="newPrice">{prod.display_price}</span>
                      <span className="oldPrice">{prod.display_standard_price}</span>
                      <span className="discount">{prod.discount} OFF</span>
                    </div>
                    :
                    <div className="price">
                      <span className="newPrice">{prod.display_price}</span>
                    </div>
                  }
                  <dl className="attributes ui-flex">
                    <dt className="cell-3">Color</dt>
                    {this.props.data.variants.map(function(item, i) {
                      return (
                        <dd className={i === this.state.variant ? 'cur' : ''}><img onClick={this.variantSet.bind(this, i ,item.id)} title={item.option_values[0].name} src={item.option_values.length > 0 ? item.option_values[0].image.normal_url : ''} /></dd>
                      )
                    },this)}
                  </dl>
                  <div className="quantity ui-flex">
                    <span className="quantity-title cell-3">Quantity</span>
                    <a className={'quantity-reduce cell-1 reduce' + this.state.quantity} onClick={this.quantitySet.bind(this, 'reduce')}><i className="iconfont">&#xe619;</i></a>
                    <span className="quantity-input cell-2">
                      <input type='text' value={this.state.quantity} onChange={this.quantityInput.bind(this)} onBlur={this.quantitySet.bind(this, 'set')} />
                    </span>
                    <a className="quantity-add cell-1" onClick={this.quantitySet.bind(this, 'add')}><i className="iconfont">&#xe616;</i></a>
                  </div>
                </div>
                <div className={'action ' + (prod.is_backorderable || prod.total_on_hand > 0 ? '' : 'disable')}>
                  <a><span>${(prod.price * this.state.quantity).toFixed(2)}</span></a>
                  {prod.is_backorderable || prod.total_on_hand > 0 ? 
                    <a className="cart" onClick={this.addCart.bind(this)}>ADD TO CART</a>
                    :
                    <a className="cart">Not Available</a>
                  }
                </div>
                <div className="jump-link" onClick={this.prodTab.bind(this, 2)}>
                  <span className="cell">Details</span>
                  <i className='iconfont'>&#xe613;</i>
                </div>
                <div className="jump-link" onClick={this.prodTab.bind(this, 3)}>
                  <span className="cell">Reviews</span>
                  <i className='iconfont'>&#xe613;</i>
                </div>
              </li>
              <li className="Description">
                {(this.props.data.pd_elem_images && this.props.data.pd_elem_images.length > 0) ?
                  <div className="pd-elem-images">
                    {this.props.data.pd_elem_images.map(function(item) {
                      return (
                        <img src={ item.large_url} />
                      )
                    })}
                  </div> :
                  this.props.data.content ?
                  <div className="pd-content" dangerouslySetInnerHTML={{__html: '<div>' + this.props.data.content + '</div>'}} /> :
                  <div className="empty">Empty</div>
                }
              </li>
              <li className="Review">
                <div className="Review-stars">
                  <div className="title">Product Reviews</div>
                  <div className="subtitle">Hear what others have to say.</div>
                  <div className="score">
                    <span className='current'>{this.state.review.star ? new Number(this.state.review.star).toFixed(1): '0.0'}</span>
                    <i>/</i>
                    <span className='full'>{this.state.review.star ? '5.0' : '0'}</span>
                  </div>
                  <div className="items">
                    {
                      this.state.review.stars.map(function(item) {
                        return (
                          <i className='iconfont'>&#xe630;<i className='iconfont' style={{width: item + '%'}}>&#xe631;</i></i>
                        )
                      })
                    }
                  </div>
                </div>
                {!this.state.review.reviews.length > 0 ? <div className="empty"></div> :
                 <div> <ul className="Review-list">
                  {this.state.review.reviews.map(function(item, i) {
                    let star = [];
                    for (var i = 1; i <= 5; i++) {
                      star.push(i <= item.star ? 1 : 0);
                    };
                    return (
                      <li className="ui-flex">
                        <div className="icon cell-4">
                          <div className="img">
                            {item.user.avatar_image ?
                              <img src={item.user.avatar_image.mini_url} /> :
                              <i className="iconfont">&#xe607;</i>
                            }
                          </div>
                          <div className="name">{item.user.email}</div>
                          <div className="star">
                            {star.map(function(item, i) {
                              return (
                                item ? <i className='iconfont cur'>&#xe631;</i> : <i className='iconfont'>&#xe630;</i>
                              )
                            })}
                          </div>
                        </div>
                        <div className="text cell-8">
                          <div>{item.title + ' ( ' + Verify.dateFormat(item.created_at) + ' )'}</div>
                          <div>{item.content}</div>
                        </div>
                      </li>
                    )
                  },this)}
                  </ul>
                  {
                    this.state.review.pages > this.state.review.current_page ? <div className="more"><i className="iconfont" onClick={this.go.bind(this)}>&#xe645;</i></div> : ''}
                  </div>
                }
              </li>
            </ul>
            :
            <div className="empty"></div>
          }
        </div>
      </div>
    );
  }

}

export default ProductPage;
