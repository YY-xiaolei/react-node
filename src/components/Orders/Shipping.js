/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component} from 'react';
import styles from './Shipping.less';
import withStyles from '../../decorators/withStyles';
import AppActions from '../../actions/AppActions';

@withStyles(styles)
class Shipping extends Component{

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };
  componentWillMount() {
    this.setState({
      packageDetail: {line_items: [], tracking_info: []}
    });
  }
  componentDidMount(){
     this.setState({
      packageDetail: JSON.parse(localStorage.getItem("shipping")),
      index: AppActions.getUrlParam("index")
    });
  }
  render() {
    let title = 'Shipping';
    this.context.onSetTitle(title);
    return (
      <div className="Shapping">
        <div className="orderDetail">
          <ul>
           { this.state.packageDetail.line_items.map(function(item, i){
              return (
                  <li>
                    <div ><img src={item.variant.images[0].product_url} /></div>
                    <div className="orderInfo">
                      <div>{item.variant.name}</div>
                      <div>Price: {item.variant.display_price}</div>
                    </div>
                  </li>
                )
            }, this)
           }
            </ul>
        </div>
        <div className="title">Order {this.state.index} shipping by {this.state.packageDetail.shipping_methods ? this.state.packageDetail.shipping_methods[0].name : ''}</div>
        <div>
          <ul className="rule-list">
          {this.state.packageDetail.tracking_info.map(function(item, i){
            return (
              <li className={i==0?'cur':''}>
                <p>{item.datetime}</p>
                <p>{item.event}</p>
                <p>{item.location}</p>
              </li>
              )
          }, this)}
        </ul>
        </div>
      </div>
    );
  }
}

export default Shipping;
