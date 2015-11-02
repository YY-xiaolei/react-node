/**
 * Created by shady on 15/6/19.
 */

import React, { PropTypes, Component } from 'react';
import styles from './Carousel.less';
import withStyles from '../../decorators/withStyles';
import ReactSwipe from '../../utils/react-swipe';
import Link from '../../utils/Link';

@withStyles(styles)

class Carousel extends Component {

  static propTypes = {
    cur: PropTypes.number,
    data: PropTypes.array.isRequired
  };
  componentWillMount() {
    //render以前执行
    this.setState({
      cur: this.props.cur,
      data: this.props.data
    });
  }
  swipeClick(i) {
    this.refs.Carousel.swipe.slide(i);
  }
  swipeCallback(i) {
    this.setState({
      cur: i
    });
  };

  render() {
    return (
      
    );
  }
}
export default Carousel;
