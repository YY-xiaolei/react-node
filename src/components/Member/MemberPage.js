import React, { PropTypes, Component } from 'react';
import AppActions from '../../actions/AppActions';
import withStyles from '../../decorators/withStyles';
import styles from './MemberPage.less';
import Dialog from '../../utils/Dialog';
import Link from '../../utils/Link';

@withStyles(styles)
class MemberPage extends Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };
  componentWillMount() {
    this.state = {
      'email': '',
      'token':'',
      'nick_name': ''
    }
  }
  componentDidMount() {
    this.setState({
      'email': AppActions.getUser().email,
      'token':AppActions.getUser().token,
      'nick_name': AppActions.getUser().nick_name,
      'avatar_image': AppActions.getUser().avatar
    })
  }

  render() {
    let title = 'Account - Anker';
    this.context.onSetTitle(title);
    return (
      <div className="MemberPage test1">
        <div className="MemberPage-container">
          <div className='banner'>
            <div>
              {this.state.token ?
                <div>
                  <a className="icon" >
                    <input type="file" accept="image/gif,image/png,image/jpg,image/bmp,image/jpeg" multiple="multiple" className="upload" onChange={this.upload.bind(this)} />
                    {this.state.avatar_image ? <img src={this.state.avatar_image} /> : <i className="iconfont">&#xe607;</i>}
                  </a>
                  <i className="iconfont editIcon">&#xe641;</i>
                </div>
                : <a className="icon" href="/login" onClick={Link.handleClick}>LOG IN</a>
              }
            </div>
            <div className="name">
              {this.state.token ?
                <span>{this.state.nick_name}</span> :
                <a href="/register" onClick={Link.handleClick}>New to anker.com?</a>
              }
            </div>
          </div>
          <div className="member-act ui-flex">
            <a className="cell-4" href="/profile" onClick={Link.handleClick}>
              <i className="iconfont" style={{'lineHeight': '2.6rem', 'fontSize': '2.6rem'}}>&#xe607;</i>
              <span className="name">Profile</span>
            </a>
            <a className="cell-4" href="/orders?page=1&per_page=20" onClick={Link.handleClick}>
              <i className="iconfont">&#xe620;</i>
              <span className="name">Orders</span>
            </a>
            <a className="cell-4" href="/address" onClick={Link.handleClick}>
               <i className="iconfont">&#xe601;</i>
              <span className="name">Address</span>
            </a>
            <a className="cell-4" href="/password" onClick={Link.handleClick}>
              <i className="iconfont" style={{'lineHeight': '2.6rem', 'fontSize': '2.3rem'}}>&#xe602;</i>
              <span className="name">Change Password</span>
            </a>
            <a className="cell-4" href="/coupon" onClick={Link.handleClick}>
              <i className="iconfont" style={{'lineHeight': '2.6rem', 'fontSize': '2.3rem'}}>&#xe639;</i>
              <span className="name">Rewards</span>
            </a>
            <a className="cell-4" href="tel:1-800-988-7973" onClick={this.callAlert.bind(this)}>
              <i className="iconfont">&#xe622;</i>
              <span className="name">Call Us</span>
            </a>
            <a className="cell-4" href="Mailto:support@anker.com" >
              <i className="iconfont">&#xe640;</i>
              <span className="name">Email Us</span>
            </a>
          </div>
        </div>
      </div>
    );
  }
  callAlert() {
    event.preventDefault();
    Dialog.confirm({'content': 'Please call 1-800-988-7973 (Mon-Fri 9am-5pm PST)'}, () => {
      location.href = "tel:1-800-988-7973";
    }, 'CANCEL')
  }
  upload(event) {
    var file = event.target.files[0], p = this;
    if(file.type.indexOf('image') === -1) {
      Dialog.showWarning('File format is not correct');
      return;
    }
    if(file.size > (1024 * 1024 * 5)) {
      Dialog.showWarning('The file size can not exceed 5M');
      return
    }
    AppActions.loading(true);
    var fd = new FormData();
    fd.append('fileName', file);
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function(evt) {p.uploadSuccess(evt)}, false);
    xhr.addEventListener('error', this.uploadFailed, false);
    xhr.open('POST', '/file');
    xhr.send(fd);
  }
  uploadSuccess(evt) {
    var file = JSON.parse(evt.target.responseText)
    if(file.id) {
      this.setState({
        'avatar_image': file.avatar_image.mini_url
      });
      localStorage.setItem('avatar_image',this.state.avatar_image);
      AppActions.loading(false);
      Dialog.showSuccess('Upload Success');
    } else {
      this.uploadFailed();
    }
  }
  uploadFailed(evt) {
    console.log(evt.target.status);
    AppActions.loading(false);
    Dialog.showWarning('upload fail');
  }
}
export default MemberPage;

