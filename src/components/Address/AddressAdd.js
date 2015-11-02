import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './Address.less';
import AppActions from '../../actions/AppActions';
import Dialog from '../../utils/Dialog'
import Verify from '../../utils/Verify';
import Link from '../../utils/Link';

@withStyles(styles)
class AddressAdd extends Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.validata = {
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
    let data;
    if(this.props.data) {
      data = this.props.data.address;
      if(data) {
        data.first_name = data.firstname;
        data.last_name = data.lastname;
      }
    } else {
      data = {
        'first_name': '',
        'last_name': '',
        'address1': '',
        'address2': '',
        'city': '',
        'country_id': '232',
        'state_name': '',
        'state_id': '',
        'zipcode': '',
        'phone': ''
      }
    }
    this.state = {
      'data': data,
      'statelist': {
        'states': []
      }
    };
  };

  componentDidMount() {
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
      this.state.data['state_name'] = event.target.selectedOptions.item(0).text;
    }
    this.setState({
      data: this.state.data
    });
  };

  validata(event) {
    var name = event.target.name;
    var vali = this.validata[name].reg;
    var value = event.target.value;
    if(!vali || vali.test(value)) {
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
      }
    }, uri = '/api/extend_addresses', method = 'POST';
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
    if(this.props.data){
      method = 'PUT',
      uri += '/' + this.state.data.id;
    }
    AppActions.postData(
      method,
      uri,
      (json) => {
        if(json.address) {
          AppActions.navigateTo('/address');
        } else {
          Dialog.showWarning(json);
        }
      },
      body
    );
  };
  cancel(){
    history.go(-1);
  }
  render() {
    let title = 'Address Add';
    this.context.onSetTitle(title);
    if(!this.state.data) {
      return (
        <div className="content-empty" style={{'background':'white'}}>
          <h1>"404!"</h1>
          <p>"page not found!"</p>
        </div>
      )
    } else {
      return (
        <div className='AddressAdd'>
          <div className='AddressAdd-container'>
            <form onSubmit={this.submit.bind(this)}>
              <ul className="input">
                <li>
                  <span>* First Name: </span>
                  <input type="text" name="first_name" maxLength="200" autoComplete="off" placeholder="" value={this.state.data.first_name} onChange={this.changeValue.bind(this)} />
                </li>
                <li>
                  <span>* Last Name: </span>
                  <input type="text" name="last_name" maxLength="200" autoComplete="off" placeholder="" value={this.state.data.last_name} onChange={this.changeValue.bind(this)} />
                </li>
                <li>
                  <span>* Address 1: </span>
                  <input type="text" name="address1" maxLength="200" autoComplete="off" placeholder="" value={this.state.data.address1} onChange={this.changeValue.bind(this)} />
                </li>
                <li>
                  <span> Address 2: </span>
                  <input type="text" name="address2" maxLength="200" autoComplete="off" placeholder="" value={this.state.data.address2} onChange={this.changeValue.bind(this)} />
                </li>
                <li>
                  <span>* City: </span>
                  <input type="text" name="city" maxLength="200" autoComplete="off" placeholder="" value={this.state.data.city} onChange={this.changeValue.bind(this)} />
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
                        <option selected={this.state.data.state_id === item.id ? true : false} value={item.id} >{item.name}</option>
                      )
                    }, this)}
                  </select>
                </li>
                <li>
                  <span>* Zip Code: </span>
                  <input type="tel" autoComplete="off" maxLength="20" name="zipcode" placeholder="" value={this.state.data.zipcode} onChange={this.changeValue.bind(this)} />
                </li>
                <li>
                  <span>* Phone Number: </span>
                  <input type="tel" autoComplete="off" maxLength="50" name="phone" placeholder="" value={this.state.data.phone} onChange={this.changeValue.bind(this)} />
                </li>
              </ul>
              <div className="action">
                <button type='submit'>SAVE</button>
                <a href="/address" onClick={Link.handleClick} type='button' className="cancelBtn" >CANCEL</a>
              </div>
            </form>
          </div>
        </div>
      );
    }
  }
}

export default AddressAdd;

