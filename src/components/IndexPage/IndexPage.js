/**
 * Created by shady on 15/7/3.
 */

import React, { PropTypes, Component } from 'react';
var Masonry = require('react-masonry-component')(React);
import styles from './IndexPage.less';
import withStyles from '../../decorators/withStyles';
import ReactSwipe from '../../utils/react-swipe';
import Link from '../../utils/Link';
import AppActions from '../../actions/AppActions';

@withStyles(styles)
class IndexPage extends Component {

  static propTypes = {
    cur: PropTypes.number,
    data: PropTypes.object.isRequired
  };
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };
  componentWillMount() {
    //render以前执行
    this.setState({
      cur: 0,
      data: this.props.data
    });
  }
  componentDidMount(){
    window.criteo_q = window.criteo_q || [];
    window.criteo_q.push(
      { event: 'setAccount', account: 22904 },
      { event: 'setHashedEmail', email: AppActions.getUser().invitation_code },
      { event: 'setSiteType', type: 'mobile' },
      { event: 'viewHome' });
  }
  swipeClick(i) {
    this.refs.Carousel.swipe.slide(i);
  }
  swipeCallback(i) {
    this.setState({
      cur: i
    });
  };
  activityClick(target, i, type, e) {
    if(!target) {
      e.preventDefault();
      Link.handleClick(e);
    }
  }

  render() {
    let title = 'Anker.com';
    this.context.onSetTitle(title);
    return (
      <div className="IndexPage">
        <div className="IndexPage-container">
          {this.state.data.master_activities ?
            <div className="Carousel">
              <ReactSwipe className="carousel-img" ref="Carousel" auto={3000} disableScroll={false} callback={this.swipeCallback.bind(this)}>
                {this.state.data.master_activities.map(function(item, i) {
                  let target = item.url ? true : false;
                  let href = item.url ? item.url : item.products.length === 1 ? ('/productpage?id=' + item.products[0].id) : '/activity?id=' + item.id;
                  return (
                    <a href={href} key={item.id} onClick={this.activityClick.bind(this, target, i, 'master')} target={target ? '_blank' : ''}>
                      <img alt={item.name} src={ item.image.large_url} />
                    </a>
                  );
                }, this)}
              </ReactSwipe>
              <div className="carousel-ctrl">
                <ol>
                  {this.state.data.master_activities.map(function(item, i) {
                    return (
                      <li key={i} className={i === this.state.cur ? 'cur' : ''} onClick={this.swipeClick.bind(this, i)}>
                        <a>{i}</a>
                      </li>
                    );
                  }, this)}
                </ol>
              </div>
            </div> : <div className="content-empty">Loading...</div>}
          <div className='module'>
            <div className='module-title'></div>
            <Masonry className={'module-content'}>
              {this.props.data.sub_activities ? this.props.data.sub_activities.map(function(item, i) {
                let target = item.url ? true : false;
                let href = item.url ? item.url : item.products.length === 1 ? ('/productpage?id=' + item.products[0].id) : '/activity?id=' + item.id;
                return (
                  <a href={href} key={item.id} onClick={this.activityClick.bind(this, target, i, 'sub')} target={target ? '_blank' : ''}>
                    <img src={item.image.large_url} />
                  </a>
                );
              }, this) : ''}
            </Masonry>
          </div>
        </div>
      </div>
    );
  }
}

export default IndexPage;
