import React, { PropTypes, Component} from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './OrderAddress.less';
import Action from './Action';
import AppActions from '../../actions/AppActions';
import AccountAdd from './AccountAdd';
import Dialog from '../../utils/Dialog';
import Link from '../../utils/Link';
import Track from '../../utils/Track';

@withStyles(styles)
class Address extends Component {

  static contextTypes = {
    data: PropTypes.object.isRequired,
    onSetTitle: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.setState({
      'address': [],
      'address_cur': {},
      'address_add': {},
      'show': 'list'
    });
  }

  componentDidMount() {
    if(!AppActions.getUser().token) {
      this.addorlist();
    } else {
      this.getUserAddress();
    }
  }

  getUserAddress() {
    AppActions.getData('GET', '/api/extend_addresses', (json) => {
      if(json.addresses && json.addresses.length > 0) {
        let address_num = -1;
        if(this.props.data.ship_address) {
          for (let i in json.addresses) {
            if(address_num === -1 && this.addressEqual(json.addresses[i])) {
              address_num = i;
            }
          }
        }
        if(address_num === -1) {
          for (let i in json.addresses) {
            if(json.addresses[i].isDefault) {
              address_num = i;
            }
          }
        }
        this.setState({
          'address': json.addresses,
          'show': 'list'
        });
        this.changeAddress(json.addresses[address_num], address_num);
      } else {
        this.addorlist();
      }
    });
  }

  addressEqual(addr) {
    let equal = this.props.data.ship_address &&
    (this.props.data.ship_address.firstname === addr.firstname &&
      this.props.data.ship_address.lastname === addr.lastname &&
      this.props.data.ship_address.address1 === addr.address1 &&
      this.props.data.ship_address.address2 === addr.address2 &&
      this.props.data.ship_address.city === addr.city &&
      this.props.data.ship_address.country_id === addr.country_id &&
      this.props.data.ship_address.state_id === addr.state_id &&
      this.props.data.ship_address.zipcode === addr.zipcode &&
      this.props.data.ship_address.phone === addr.phone);
    return equal;
  }

  changeAddress(item, i) {
    this.setState({
      'address_cur': {
        'firstname': item.firstname,
        'lastname': item.lastname,
        'address1': item.address1,
        'address2': item.address2,
        'city': item.city,
        'phone': item.phone,
        'zipcode': item.zipcode,
        'state_id': item.state_id,
        'country_id': item.country_id
      }
    });
    if(i || (i === 0)) {
      this.setState({
        'address_num': i
      });
    }
  }

  addorlist() {
    this.setState({
      show: this.state.show === 'add' ? 'list' : 'add'
    });
  }

  backList() {
    document.body.scrollTop = 0;
    AppActions.getData('GET', '/api/extend_addresses', (json) => {
      this.setState({
        address: json.addresses,
        show: 'list'
      });
      this.changeAddress(json.addresses[json.addresses.length - 1], json.addresses.length - 1);
    });
  }

  delivery(address) {
    if(this.state.address.length <= 0) {
      Dialog.showWarning('Please set a shipping address before');
      this.addorlist();
      return ;
    }
    let body = {
      'id': AppActions.getUser().order_id,
      'state': 'address'
    };
    if(this.state.address_cur.firstname) {
      body['order'] = {
        'bill_address_attributes': address,
        'ship_address_attributes': address
      };
    }
    AppActions.postData(
      'PUT',
      '/api/checkouts/' + AppActions.getUser().order_id,
      (json) => {
        // console.log(this.state.data, json);
        if(json.state === 'delivery') {
          Track.ecCheckout(json.line_items, 2);
          AppActions.navigateTo('/delivery');
        } else {
          Dialog.showWarning(json);
        }
      },
      body
    );
  }

  render() {
    let title = 'Address';
    this.context.onSetTitle(title);
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
    return (
      <div>
        <AccountAdd data={this.props.data} show={this.state.show} back={this.backList.bind(this)} cancel={this.addorlist.bind(this)} />
        <div className={'Address ' + this.state.show}>
          <div className="Address-container">
            <div className="title">*We will use your shipping address into billing address. </div>
            <div className="address-list">
              <ul>
                {this.state.address.map(function(item, i) {
                  return (
                    <li key={i} onClick={this.changeAddress.bind(this, item, i)}>
                      <div className="name">{item.firstname} {item.lastname}</div>
                      <div className="phone">{item.phone}</div>
                      <div className="address">{item.address1} {!item.address2 ? '' : item.address2}</div>
                      <div className="state">{item.city},{item.state_name} {item.zipcode}</div>
                      <div className="contry">USA</div>
                      {i == this.state.address_num ?
                      <div className="select"><i className="iconfont">&#xe60a;</i></div> : ''
                      }
                    </li>
                  );
                }, this)}
              </ul>
              <a className="address-add-btn" onClick={this.addorlist.bind(this)}>+</a>
            </div>

            <div className="order-space" >
              <img src={require("../../public/car.png")} />
            </div>

            {this.props.data.line_items ?
              <Action data={this.props.data} checkout={this.delivery.bind(this, this.state.address_cur)} step={2} />
              : ''}
          </div>
        </div>
      </div>
    );
  }
}

export default Address;
