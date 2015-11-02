import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './AccountAdd.less';
import AppActions from '../../actions/AppActions';
import Dialog from '../../utils/Dialog';
import Verify from '../../utils/Verify';

@withStyles(styles)
class AddressAdd extends Component {

  static propTypes = {
    back: PropTypes.func.isRequired,
    data: PropTypes.object,
    show: PropTypes.string,
    cancel: PropTypes.string
  }
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };
  componentWillMount() {
    this.validata = {
      'email': {
        'reg': Verify.reg().email,
        'error': 'Please enter a valid email address (Example: name@domain.com)',
        'isEmpty': false,
        'emptyErr': 'Please enter your email address'
      },
      'first_name': {
        'isEmpty': false,
        'emptyErr': 'Please complete all fields marked * '
      },
      'last_name': {
        'isEmpty': false,
        'emptyErr': 'Please complete all fields marked * '
      },
      'address1': {
        'isEmpty': false,
        'emptyErr': 'Please complete all fields marked * '
      },
      'country_id': {
        'isEmpty': false,
        'emptyErr': 'Please complete all fields marked * '
      },
      'state_id': {
        'isEmpty': false,
        'emptyErr': 'Please complete all fields marked * '
      },
      'city': {
        'isEmpty': false,
        'emptyErr': 'Please complete all fields marked * '
      },
      'zipcode': {
        'isEmpty': false,
        'emptyErr': 'Please complete all fields marked * '
      },
      'phone': {
        'isEmpty': false,
        'emptyErr': 'Please complete all fields marked * '
      }
    };
    this.state = {
      'token': '',
      'data': {
        'nick_name': '',
        'email': '',
        'first_name': '',
        'last_name': '',
        'address1': '',
        'address2': '',
        'city': '',
        'country_id': '232',
        'state_name': '',
        'state_id': '',
        'zipcode': '',
        'phone': '',
        'is_subscribe': true
      },
      'statelist': {
        'states': []
      }
    };
  };
  componentDidMount() {
    this.setState({
      'token': AppActions.getUser().token
    });
    AppActions.getData('get', '/api/countries/232/states', (json)=> {
      if(json.states) {
        this.setState({
          'statelist': json
        });
      }
    });
  };
  changeValue(event) {
    this.state.data[event.target.name] = event.target.value;
    if(event.target.name === 'state_id') {
      this.state.data.state_name = event.target.selectedOptions.item(0).text;
    }
    this.setState({
      data: this.state.data
    });
  };
  validata(event) {
    var name = event.target.name;
    var vali = this.validata[name].reg;
    var value = event.target.value;
    if(vali.test(value)) {
      this.state.data[event.target.name] = event.target.value;
      this.setState({
        data: this.state.data
      });
    } else {
      return false;
    }
  };
  submit() {
    event.preventDefault();
    let body = {
      address: {
        'first_name': this.state.data.first_name,
        'last_name': this.state.data.last_name,
        'address1': this.state.data.address1,
        'address2': this.state.data.address2,
        'city': this.state.data.city,
        'country_id': this.state.data.country_id,
        'state_name': this.state.data.state_name,
        'state_id': this.state.data.state_id,
        'zipcode': this.state.data.zipcode,
        'phone': this.state.data.phone
      },
      'order_id': AppActions.getUser().order_id
    }, p = this;
    if(!AppActions.getUser().token) {
      body.address.email = this.state.data.email;
      body.address.nick_name = (this.state.data.first_name + ' ' + this.state.data.last_name);
      body.address.is_subscribe = this.state.data.is_subscribe;
    }
    for(let item in body.address) {
      if(this.validata[item]) {
        if(!this.validata[item].isEmpty && body.address[item].toString().trim() === '') {
          Dialog.showWarning(this.validata[item].emptyErr);
          return false;
        }
        if(this.validata[item].reg && !this.validata[item].reg.test(body.address[item])){
          Dialog.showWarning(this.validata[item].error);
          return false;
        }
      }
    }
    AppActions.postData(
      'POST',
      '/api/extend_addresses',
      (json) => {
        if(json.token) {
          json.email = this.state.data.email;
          json.nick_name = this.state.data.first_name + ' ' + this.state.data.last_name;
          AppActions.regWithAddress(json);
          localStorage.setItem('user_password', json.user_password);
          Dialog.confirm({
            'title': 'Confirm',
            'content': '<p>In order to make you easy complete the payment</p><p>We created a temporary account for you</p><p>Email: <span style="color:#3aa6e1">' + json.email + '</span></p><p>Temporary password: <span style="color:#3aa6e1">' + json.user_password + '</span></p><p>You can go to “Account” page to change password after paying</p>'
          }, () => {
            p.address(json.address);
          });
        } else if(json.address) {
          this.props.back();
        } else {
          Dialog.showWarning(json);
        }
      },
      body
    );
    return false;
  }
  address(attr) {
    let body = {
      'id': AppActions.getUser().order_id,
      'state': 'cart'
    };
    AppActions.postData(
      'PUT',
      '/api/checkouts/' + AppActions.getUser().order_id,
      (json) => {
        if(!json.response) {
          this.delivery({
            'firstname': attr.firstname,
            'lastname': attr.lastname,
            'address1': attr.address1,
            'address2': attr.address2,
            'city': attr.city,
            'phone': attr.phone,
            'zipcode': attr.zipcode,
            'state_id': attr.state_id,
            'country_id': attr.country_id
          });
        } else {
          Dialog.showWarning(json);
        }
      },
      body
    );
  }
  delivery(addr) {
    let body = {
      'id': AppActions.getUser().order_id,
      'state': 'address',
      'order': {
        'bill_address_attributes': addr,
        'ship_address_attributes': addr
      }
    };
    AppActions.postData(
      'PUT',
      '/api/checkouts/' + AppActions.getUser().order_id,
      (json) => {
        if(json.state === 'delivery') {
          AppActions.navigateTo('/delivery');
        } else {
          AppActions.navigateTo('/address');
        }
      },
      body
    );
  }

  subscribe() {
    this.state.data.is_subscribe = this.state.data.is_subscribe ? false : true;
    this.setState(this.state);
  }

  render() {
    let title = 'Address Email';
    this.context.onSetTitle(title);
    return (
      <div className={'AddressAdd ' + this.props.show}>
        <div className="title" style={{'display': 'none'}}>*We will use your shipping address into billing address. </div>
        <div className='AddressAdd-container'>
          <form action="/delivery" onSubmit={this.submit.bind(this)}>
            <ul className="input">
              {!this.state.token ?
                <li>
                  <span>* Email:</span>
                  <input type="email" autoComplete="off" maxLength="200"  name="email" placeholder="" value={this.state.data.email} onChange={this.changeValue.bind(this)} />
                </li> : ''}
              <li>
                <span>* First Name: </span>
                <input type="text" autoComplete="off" maxLength="200"  name="first_name" placeholder="" value={this.state.data.first_name} onChange={this.changeValue.bind(this)} />
              </li>
              <li>
                <span>* Last Name: </span>
                <input type="text" autoComplete="off" maxLength="200"  name="last_name" placeholder="" value={this.state.data.last_name} onChange={this.changeValue.bind(this)} />
              </li>
              <li>
                <span>* Address 1: </span>
                <input type="text" autoComplete="off" maxLength="200"  name="address1" placeholder="" value={this.state.data.address1} onChange={this.changeValue.bind(this)} />
              </li>
              <li>
                <span>  Address 2: </span>
                <input type="text" autoComplete="off" maxLength="200"  name="address2" placeholder="" value={this.state.data.address2} onChange={this.changeValue.bind(this)} />
              </li>
              <li>
                <span>* City: </span>
                <input type="text" autoComplete="off" maxLength="200" name="city" placeholder="" value={this.state.data.city} onChange={this.changeValue.bind(this)} />
              </li>
              <li>
                <span>* Country: </span>
                <input type="text" autoComplete="off" readOnly="readonly" value="USA" />
              </li>
              <li>
                <span>* State: </span>
                <select name="state_id" onChange={this.changeValue.bind(this)}>
                  <option value="" autoComplete="off">Please select</option>
                  {this.state.statelist.states.map(function(item) {
                    return (
                      <option value={item.id}>{item.name}</option>
                    );
                  }, this)}
                </select>
              </li>
              <li>
                <span>* Zip Code:</span>
                <input type="tel" autoComplete="off" maxLength="20" name="zipcode" placeholder="" value={this.state.data.zipcode} onChange={this.changeValue.bind(this)} />
              </li>
              <li>
                <span>* Phone Number: </span>
                <input type="tel" autoComplete="off" maxLength="50" name="phone" placeholder="" value={this.state.data.phone} onChange={this.changeValue.bind(this)} />
              </li>
              {!this.state.token ?
                <li className='auth-act'>
                  <div onClick={this.subscribe.bind(this)}>
                    {this.state.data.is_subscribe ?
                      <i className='iconfont checked'>&#xe633;</i> :
                      <i className='iconfont'>&#xe634;</i>
                    } Subscribe me to the Anker Newsletter
                  </div>
                </li> : ''}
            </ul>
            <div className="action">
              <button type='submit'>{this.state.token ? 'SAVE' : 'NEXT'}</button>
              {this.state.token ? <a onClick={this.props.cancel}>CANCEL</a> : ''}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default AddressAdd;
