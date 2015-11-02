import React, { PropTypes, Component } from 'react';
import AppActions from '../../actions/AppActions';
import withStyles from '../../decorators/withStyles';
import styles from './ProfilePage.less';
import Dialog from '../../utils/Dialog';
import Verify from '../../utils/Verify';
import config from '../../config/config.js';

@withStyles(styles)
class ProfilePage extends Component {

  static contextTypes = {
    data: PropTypes.object.isRequired,
    onSetTitle: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.state = {
      'host': 'm.anker.com',
      'data': {},
      'editdata': {},
      'editable': '',
      'statelist': {
        'states': []
      },
      'reg': {
        'email': /^&/,
        'gender': /^$/,
        'dob': /^$/,
        'phone_number': /^$/,
        'country_id': /^$/,
        'state_id': /^$/,
        'nick_name': /^$/
      }
    };
  }

  componentDidMount() {
    this.setState({
      'host': location.host
    })
    if (!this.props.data.login) {
      AppActions.navigateTo('/login');
    } else {
      this.props.data.dob = this.props.data.dob ? Verify.dateFormat(this.props.data.dob ,'yy-mm-dd') : '';
      this.setState({
        'data': this.props.data
      });
      localStorage.setItem('avatar_image', this.props.data.avatar_image ? this.props.data.avatar_image.mini_url : '');
      localStorage.setItem('nick_name', this.props.data.nick_name);
      this.setEditProfile(this.props.data);
    }
    AppActions.getData('get', '/api/countries/232/states', (json) => {
      if (json.states) {
        this.setState({
          'statelist': json
        });
      }
    });
  }

  setEditProfile(json) {
    json.dob = json.dob ? Verify.dateFormat(json.dob ,'yy-mm-dd') : '';
    localStorage.setItem('profile', JSON.stringify(json));
    this.setState({
      'editdata': JSON.parse(localStorage.getItem('profile'))
    });
  }

  valueChange() {
    this.state.editdata[event.target.name] = event.target.value;
    this.setState({
      'editdata': this.state.editdata
    });
  }

  editChange() {
    this.setState({
      'editable': this.state.editable ? '' : 'editable'
    });
  }

  submitChange() {
    if(this.state.editdata.nick_name === '') {
      Dialog.showWarning("User Name Can not be empty");
      return false;
    }
    let body = {
      'profile': this.state.editdata
    };
    AppActions.postData('put', '/api/users/update_profile', (json) => {
      if (json.id) {
        this.setState({
          data: json
        });
        localStorage.setItem('nick_name', json.nick_name);
        this.editChange();
        this.setEditProfile(json);
        Dialog.showSuccess('Changes Saved');
      } else {
        Dialog.showWarning(json);
      };
    }, body);
  }
  signOut() {
    Dialog.confirm(
      {
        'content': 'Goodbye!'
      },
      () => {
        AppActions.signOut();
        AppActions.navigateTo('/member');
      }
    )
  }
  upload(event) {
    var file = event.target.files[0],
      p = this;
    if (file.type.indexOf('image') === -1) {
      Dialog.showWarning('File format is not correct');
      return;
    }
    if (file.size > (1024 * 1024 * 5)) {
      Dialog.showWarning('The file size can not exceed 5M');
      return
    }
    AppActions.loading(true);
    var fd = new FormData();
    fd.append('fileName', file);
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function(evt) {
      p.uploadSuccess(evt)
    }, false);
    xhr.addEventListener('error', this.uploadFailed, false);
    xhr.open('POST', '/file');
    xhr.send(fd);
  }

  uploadSuccess(evt) {
    var file = JSON.parse(evt.target.responseText)
    if (file.id) {
      this.state.data.avatar_image = file.avatar_image;
      this.setState(this.state);
      localStorage.setItem('avatar_image', this.state.data.avatar_image.mini_url);
      AppActions.loading(false);
      Dialog.showSuccess('Changes Saved');
    } else {
      this.uploadFailed();
    }
  }
  uploadFailed() {
    AppActions.loading(false);
    Dialog.showWarning('Upload failed, please try again');
  }
  render() {

    let title = 'Profile';
    this.context.onSetTitle(title);
    return (
      <div className="ProfilePage">
        <div className="ProfilePage-container">

          <div className='banner'>
            <div>
              {this.state.data.login ?
                <div>
                  <a className="icon" >
                    <input autoComplete="off" type="file" accept="image/gif,image/png,image/jpg,image/bmp,image/jpeg" multiple="multiple" className="upload" onChange={this.upload.bind(this)} />
                    {this.state.data.avatar_image ? <img src={this.state.data.avatar_image.mini_url} /> : <i className="iconfont">&#xe607;</i>}
                  </a>
                  <i className="iconfont editIcon">&#xe641;</i>
                </div>: ''
              }
            </div>
          </div>
          <div className="profile">
            <ul className={this.state.editable}>
              <li>
                <span>User Name: </span>
                {!this.state.editable ?
                  <input readOnly="readonly" maxLength="200" type="text" value={this.state.data.nick_name} /> :
                  <input autoComplete="off" maxLength="200" name="nick_name" type="text" onChange={this.valueChange.bind(this)} value={this.state.editdata.nick_name} />
                }
              </li>
              <li>
                <span>Email: </span>
                <input readOnly="readonly" maxLength="200" value={this.state.data.login} />
              </li>
              <li>
              <span>Gender: </span>
                {!this.state.editable ?
                  <input readOnly="readonly" type="text" value={this.state.data.gender} /> :
                  <select autoComplete="off" name="gender" onChange={this.valueChange.bind(this)}>
                    <option>Please select</option>
                    <option selected={this.state.editdata.gender === 'Male' ? true : false}>Male</option>
                    <option selected={this.state.editdata.gender === 'Female' ? true : false}>Female</option>
                  </select>
                }
              </li>
              <li>
              <span>DOB: </span>
                {!this.state.editable ?
                  <input readOnly="readonly" maxLength="200" type="text" value={this.state.data.dob} /> :
                  <input name="dob" maxLength="200" type="date" onChange={this.valueChange.bind(this)} value={Verify.dateFormat(this.state.editdata.dob ,'yy-mm-dd')} />
                }
              </li>
              <li>
                <span>Phone Number: </span>
                {!this.state.editable ?
                  <input readOnly="readonly" maxLength="200" type="text" value={this.state.data.phone_number} /> :
                  <input autoComplete="off" maxLength="200" name="phone_number" type="tel" onChange={this.valueChange.bind(this)} value={this.state.editdata.phone_number} />
                }
              </li>
              <li>
                <span>Country: </span>
                <input readOnly="readonly" type="text" value="USA" />
              </li>
              <li>
                <span>State: </span>
                {!this.state.editable ?
                  this.state.statelist.states.map(function(item) {
                    if(item.id == this.state.data.state_id) {
                      return (
                        <input readOnly="readonly" type="text" value={item.name} />
                      );
                    }
                  }, this) :
                  <select autoComplete="off" name="state_id" onChange={this.valueChange.bind(this)}>
                    <option >Please select</option>
                    {this.state.statelist.states.map(function(item) {
                      return (
                        <option value={item.id} selected={this.state.editdata.state_id === item.id ? true : false}>{item.name}</option>
                        );
                    }, this)}
                  </select>
                }
              </li>
              {this.props.data.invitation_code ?
                <li>
                  <div className="invited">
                    <div className="title">Invitation Link</div>
                    <div className="intro">Copy this link to your social media accounts and invite friends to join us:</div>
                    <a className="link">{'http://' + this.state.host + '/register?invite=' + this.props.data.invitation_code}</a>
                  </div>
                </li>
                :
                ''}
            </ul>
          </div>

          <div className="action">
            {this.state.editable ?
              <div>
                <a className="save" onClick={this.submitChange.bind(this)}>SAVE</a>
                <a className="cancel" onClick={this.editChange.bind(this)}>CANCEL</a>
              </div> :
              <div>
                  <a className="edit" onClick={this.editChange.bind(this)}>EDIT</a> 
              </div>
            }
            <a className="logout" onClick={this.signOut.bind(this)}>LOG OUT</a>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfilePage;