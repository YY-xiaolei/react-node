import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './Search.less';
import AppActions from '../../actions/AppActions';

@withStyles(styles)
class Search extends Component {

  static propTypes = {
    show: PropTypes.string,
    data: PropTypes.object.isRequird,
    callback: PropTypes.func.isRequird
  }
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  }
  componentWillMount() {
    this.setState({});
  }

  componentDidMount(){
    this.setState({
      'screenH': screen.height * .7 + 'px'
    });
  }

  searchkey(event) {
    this.setState({
      searchKey: event.target.value
    });
  }

  keywordSubmit(event) {
    AppActions.navigateTo('/productlist?keyword=' + event.currentTarget.innerHTML + '&page=1&per_page=20');
  }

  searchSubmit(event) {
    event.preventDefault();
    fbq('track', 'Search');
    AppActions.navigateTo('/productlist?keyword=' + this.state.searchKey + '&page=1&per_page=20');
    return;
  }

	render() {
    let title = 'Search';
    this.context.onSetTitle(title);
    return (
      <div className="SearchPage">
        <div className="SearchPage-container">
          <div className="search-input">
            <form className="ui-flex" onSubmit={this.searchSubmit.bind(this)}>
              <div className="cell">
                <input type="text" placeholder="What are you looking for?" onChange={this.searchkey.bind(this)} />
              </div>
              <div className="cell-3">
                <button type='submit'>SEARCH</button>
              </div>
            </form>
          </div>
          <div className="search-result" style={{'minHeight': this.state.screenH}}>
            <dl>
              <dt>Trending:</dt>
              {(this.props.data && typeof(this.props.data) === 'object') ? this.props.data.map(function(item, i) {
                return (
                  <dd key={item.id} onClick={this.keywordSubmit.bind(this)}>{item.name}</dd>
                );
              }, this) : <dd className="empty">Empty</dd>}
            </dl>
          </div>
        </div>
      </div>
  	);
	}
}

export default Search;
