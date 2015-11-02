/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component} from 'react';
import AppActions from '../../actions/AppActions';
import styles from './Feedback.less';
import withStyles from '../../decorators/withStyles';
import Dialog from '../../utils/Dialog';

@withStyles(styles)
class Feedback extends Component{

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };
  componentWillMount() {
    this.setState({
      'title': '',
      'content': '',
      'feedback_items':this.props.data.feedback_items || []
    });
  }
  componentDidMount() {
    this.setState({
      'nick_name': AppActions.getUser().nick_name
    })
  }
  render() {
    let title = 'Feedback';
    this.context.onSetTitle(title);
    return (
      <div className="Feedback">
        <div className="Feedback-container">
          <div className="Feedback-input"><input type="input" value={this.state.title} placeholder="Title" onChange={this.valueChange.bind(this, 'title')} /></div>
          <div className="Feedback-textarea"><textarea placeholder="Content" value={this.state.content} onChange={this.valueChange.bind(this, 'content')}></textarea> </div>
          <div className="Feedback-submit"><a onClick={this.submit.bind(this)}>Submit</a></div>
        </div>
        <div className="Feedback-list">
          {this.state.feedback_items.length > 0 ?
              this.state.feedback_items.map(function(item, i) {
                var d = new Date(item.created_at), day = d.getDate(), month = d.getMonth() + 1;
                return (
                  <div className="Feedback-listContent">
                    <div className ="lt">
                      {item.user.avatar_image ?
                        <img src={item.user.avatar_image.mini_url} alt="" /> :
                        <i className="iconfont">&#xe607;</i>
                      }
                      <span>{this.state.nick_name}</span>
                    </div>
                    <div className="rt">
                      <p>Date:{(month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day) + '-' + d.getFullYear()}</p>
                      <p>Title:{item.title}</p>
                      <p>Content:</p>
                      <p className="content">{item.content}</p>
                    </div>
                  </div>
                );
              }) : '' }
         </div>
      </div>
    );
  }
  
  valueChange(type, event) {
    var val = {};
    val[type]= event.target.value;
    this.setState(val);
  }
  submit(e) {
    e.preventDefault();
    if(this.state.title === '') {
      Dialog.showWarning('title can not be empty');
      return;
    }
    let body = {
      feedback_item: {
        title: this.state.title,
        content: this.state.content
      }
    };
    AppActions.postData(
      'POST',
      '/api/feedback_items/',
      (json) => {
        if(json.error || json.exception) {
          Dialog.showWarning(json);
        } else {
          Dialog.showSuccess('Success');
          this.setState({'title': '', 'content': ''});
          this.getList();
        }
      }, body
    );

  }
  getList(){
    AppActions.getData(
      'get',
      '/api/feedback_items?page=1&per_page=5',
      (json) => {
        if(json.feedback_items){
          this.setState({
            feedback_items:json.feedback_items
          });
        }
      }
    );
  }

}

export default Feedback;
