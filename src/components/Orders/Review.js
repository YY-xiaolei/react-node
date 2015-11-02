
/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component} from 'react';
import AppActions from '../../actions/AppActions';
import styles from './Review.less';
import withStyles from '../../decorators/withStyles';
import Dialog from '../../utils/Dialog';
import Verify from '../../utils/Verify';

@withStyles(styles)
class Review extends Component{

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };
  reviewList = [];
  componentWillMount() {
    this.state = {
      'orderTime': '',
      'line_items': this.props.data.line_items,
      'isReview': this.props.data.line_items ? (this.props.data.line_items[0].review ? true : false) : false
    }
   //this.setState();
  }
  componentDidMount(){
    if(this.state.isReview)
    {
      this.state.orderTime = Verify.dateFormat(this.props.data.line_items[0].review.updated_at);
    }else{
      this.state.orderTime = localStorage.getItem('orderTime');
    }
    this.setState(this.state);
  }
  render() {
    let title = 'Review';
    this.context.onSetTitle(title);
    return (
      <div className="Review">
        <div className="title"><span>{this.state.orderTime}</span><span className="status">{this.state.isReview ? 'Complete' : 'Awaiting your feedback'}</span></div>
        <ul >
          {
          this.state.line_items ?
          this.state.line_items.map(function(item, i) {
            let defaultReview = {
                'line_item_id': item.id,
                'title': '',
                'content': '',
                'star': 5
              }, startList = [];
            if(!item.review) {
              item.review = defaultReview;
            }
            for(var z = 1; z < 6; z++) {
              item.review.star >= z ? startList.push(1) : startList.push(0);
            }
            
            return (<li>
              <div className="orderDetail">
                <div className="orderImg"><img src={ item.variant.images[0].large_url} /></div>
                <div className="orderInfo">
                  <div>{item.variant.name}</div>
                  <div><span>Price: {item.variant.display_standard_price}</span><span className="sale">{item.variant.display_standard_price !== item.variant.display_price ? 'Sale: ' + item.variant.display_price : ''}</span></div>
                </div>
              </div>
              <div className="star" onClick={this.onStar.bind(this, i)}>
                {
                  startList.map(function(item, z){
                    return ((item === 0 ? <i className='iconfont' data-key={z}>&#xe630;</i>:<i className='iconfont onStar' data-key={z}>&#xe631;</i>));
                  })
                }
              </div>
              <div className="reviewContent">
                <div>{this.state.isReview ? <input type="text" readOnly="readonly" placeholder="Title" value={item.review.title} /> : <input type="text" placeholder="Title" value={item.review.title} onChange={this.setValue.bind(this, 'title', i)} />}</div>
                <div>{this.state.isReview ? <textarea placeholder="Content" readOnly="readonly" value={item.review.content}> </textarea> : <textarea placeholder="Content" onChange={this.setValue.bind(this,'content', i)} value={item.review.content}> </textarea>}</div>
              </div>
            </li>);
          },this) : ''}
        </ul>
        <div className="submit">
          {this.state.isReview ? '' : <a onClick={this.submit.bind(this)}>OK</a>}
          <a onClick={this.cancel.bind(this)}>CANCEL</a>
        </div>
      </div>
    );
  }
  onStar(index, e){
    if(!this.state.isReview){
      var star = parseInt(e.target.getAttribute('data-key') || -1 );
      if(star === -1) {return;}
      this.state.line_items[index]['review']['star'] = star + 1;
      this.setState(this.state);
    }
  }
  setValue(key, index, e){
    if(!this.state.isReview){
      this.state.line_items[index]['review'][key] = e.target.value;
    }
    this.setState(this.state);
  }
  submit(){
    var reviewList = [], p = this;
    for(var i = 0, j = this.state.line_items.length; i < j; i++){
      reviewList.push(this.state.line_items[i].review);
    }
    AppActions.postData(
      'POST',
      '/api/orders/' + this.props.data.number + '/reviews',
      (json) => {
        if(json.error || json.exception) {
          Dialog.showWarning(json);
        } else {
          Dialog.showSuccess('Review successfully');
          AppActions.navigateTo('/orderdetail?number=' + p.props.data.number + '&his=1');
        }
      },
      {reviews: reviewList, his: 1}
    );
  }
  cancel(){
    history.go(-1);
  }
  
}

export default Review;

