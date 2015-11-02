/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component} from 'react';
import AppActions from '../../actions/AppActions';
import styles from './Address.less';
import withStyles from '../../decorators/withStyles';
import Dialog from '../../utils/Dialog';
import Link from '../../utils/Link';

@withStyles(styles)
class Address extends Component{

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };
  componentWillMount() {
    this.setState({
      'addresses': this.props.data.addresses || []
    });
  }
  render() {
    let title = 'Address';
    this.context.onSetTitle(title);
    return (
      <div className="Address">
        <div className="Address-container">
          <ul>
            {this.state.addresses.map(function(item, i) {
                return (
                  <li >
                    <div className="Address-left">
                      <div><h4>Address: <span className="defaultsColor">{item.isDefault ? '(primary)' : ''}</span></h4></div>
                      <div className="name"><span>{item.firstname} {item.lastname}</span><span className="phone">{item.phone}</span></div>
                      <div className="address">{item.address1} {!item.address2 ? '' : ' ' + item.address2}</div>
                      <div className="state">{item.city}, {item.state_name} {item.zipcode}</div>
                      <div className="contry">USA</div>
                    </div>
                    <div className="deleteBtn">
                      <a onClick={this.deleteAddress.bind(this, item.id)} ><i className="iconfont">&#xe63d;</i></a>
                      <a onClick={this.editAddress.bind(this, item.id)}><i className="iconfont">&#xe63f;</i></a>
                    </div>
                    {item.isDefault ?
                      <div className="selectedIcn" >
                        <i className="iconfont selected">&#xe632;</i>
                      </div>
                      :
                      <div className="setDefaultBtn">
                        <a className="setDefault_a"  onClick={this.setDefault.bind(this, item.id)}>Set as primary</a>
                      </div>
                    }
                  </li>
                );
              }, this)}
          </ul>
        </div>
        <div>
          <a className="Address-add" href="/addressadd" onClick={Link.handleClick}>ADD ADDRESS</a>
        </div>
      </div>
    );
  }
  deleteAddress(id, e){
    e.preventDefault();
    AppActions.postData(
      'DELETE',
      '/api/extend_addresses/'+id,
      (json) => {
        if(json && (json.error || json.exception)) {
          Dialog.showWarning(json);
        } else {
          Dialog.showSuccess('Address deleted');
          this.getList();
        }
      }
    );
  }
  editAddress(id){
    AppActions.navigateTo('/addressedit?id=' + id);
  }
  getList(){
    AppActions.getData(
      'get',
      '/api/extend_addresses',
      (json) => {
        if(json.addresses){
          this.setState({
            addresses: json.addresses
          });
        }
      }
    );
  }
  setDefault(id, e){
    e.preventDefault();
    AppActions.postData(
      'PUT',
      '/api/extend_addresses/' + id + '/set_default',
      (json) => {
        if(json.error || json.exception) {
          Dialog.showWarning(json);
        } else {
          Dialog.showSuccess('Primary Address Changed');
          this.getList();
        };
      }
    );
  }

}

export default Address;

