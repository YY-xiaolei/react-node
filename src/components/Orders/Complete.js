import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import AppActions from '../../actions/AppActions';
import styles from './Complete.less';
import Link from '../../utils/Link';
import Track from '../../utils/Track';

@withStyles(styles)
class Complete extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired
  };

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.setState({
      'now': new Date().getMonth() + 1 + ' / ' + new Date().getDate() + ' / ' + new Date().getFullYear(),
      'user_password': '',
      'email': '',
      'paid': ''
    });
  }

  componentDidMount() {
    this.setState({
      'user_password': localStorage.getItem('user_password'),
      'email': AppActions.getUser().email,
      'paid': AppActions.getUrlParam().paid
    });
    if(AppActions.getUrlParam().paid === 'true') {
      Track.ecPurchase();
      fbq('track', 'Purchase', {value: localStorage.getItem('order_price'), currency: 'USD'});
    }
    localStorage.removeItem('user_password');
    localStorage.removeItem('order_price');
  };

  render() {
    let title = 'Complete';
    this.context.onSetTitle(title);
    return (
      <div className="Complete">
        <div className="Complete-container">
          {this.state.paid ?
            this.state.paid === 'true' ?
              <div className="Complete-mod">
                <p>Payment processed</p>
                <div className="links">
                  <a href="/orders" onClick={Link.handleClick} >Check Order</a>
                </div>
                {this.state.user_password ?
                  <div>
                    <p>------------------------ and -------------------------</p>
                    <p>We create a new account for You</p>
                    <p>account:<span className="blue">{this.state.email}</span></p>
                    <p>password:<span className="blue">{this.state.user_password}</span></p>
                    <div className="links">
                      <a href="/password" onClick={Link.handleClick}>Modify your password</a>
                    </div>
                  </div> : ''
                }
              </div>
              :
              <div className="Complete-mod">
                <h5>OPPS!</h5>
                <p>Failed to Pay</p>
                <p></p>
                <p>Your may want</p>
                <div className="links">
                  <a href="/orders" onClick={Link.handleClick} >Check Order</a>
                </div>
              </div>
            : ''
          }
        </div>
      </div>
    );
  }

}

export default Complete;
