/**
 * Created by shady on 7/8/15.
 */

import React, { PropTypes, Component } from 'react';
import styles from './Category.less';
import withStyles from '../../decorators/withStyles.js';
import classNames from 'classnames';
import AppActions from '../../actions/AppActions';

@withStyles(styles)
class Category extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired,
    show: PropTypes.string
  };
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  arrowToggle(i, j) {
    var item = this.props.data.taxonomies[0].root.taxons;
    if(j !== null) {
      item = item[i].taxons[j];
    } else if(i !== null) {
      item = item[i];
    }
    item.show = item.show ? '' : 'show';
    this.setState({
      data: this.props.data
    });
  }

  category(id, index) {
    AppActions.navigateTo('/productlist?taxon_id=' + id +'&index=' + index);
    return;
  }

  render() {
    let title = 'Category';
    this.context.onSetTitle(title);
    return (
      <div className="CategoryPage">
        <div className="CategoryPage-container">
          {(this.props.data && this.props.data.taxonomies) ? this.props.data.taxonomies[0].root.taxons.map(function(item, i) {
            return (
              <div key={item.id}>
                <a className={classNames('category-title', item.show)}
                  style={{'backgroundImage': 'url(' + (item.icon ? item.icon.large_url : '') + ')'}}
                  onClick={item.taxons.length > 0 ? this.arrowToggle.bind(this, i, null, null) : this.category.bind(this, item.id, i) }
                ><span>{item.name}</span></a>
                {item.taxons.length > 0 ?
                  <div className={classNames('category-menu', item.show)}>
                    {item.taxons.map(function(item1,j) {
                      return (
                        <a className='category-item ui-flex' key={item1.id} onClick={this.category.bind(this, item1.id, j)}>
                          <span className="cell">{item1.name}</span>
                          <i className='iconfont'>&#xe613;</i>
                        </a>
                      );
                    }, this)}
                  </div> : ''}
              </div>
            );
          }, this) : <div className="content-empty">Empty</div> }
        </div>
      </div>
    );
  }
}

export default Category;

