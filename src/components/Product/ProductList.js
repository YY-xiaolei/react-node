/**
 * Created by shady on 15/6/29.
 */

import React, { PropTypes, Component } from 'react';
import styles from './Product.less';
import withStyles from '../../decorators/withStyles';
import Link from '../../utils/Link';
import AppActions from '../../actions/AppActions';
import Track from '../../utils/Track';

@withStyles(styles)
class ProductList extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired
  };
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };
  productIdList = [];
  componentWillMount() {
    this.state = {
       'screenH': '350px',
      'data': this.props.data,
      'tab_wrap': '',
      'isSearch': false,
      'searchKey': ''
    }
    if(global.window){
      this.state.tab = AppActions.getUrlParam().index  || 0;
      this.state.searchKey = AppActions.getUrlParam().keyword || '';
      this.state.isSearch = !this.state.searchKey ? false : true;
      this.pageIndex = AppActions.getUrlParam('page');
    }
  }
  componentDidMount() {
    this.state.screenH = screen.height * .73 + 'px';
    this.setState(this.state);
    this.taxonChild();
    window.criteo_q = window.criteo_q || [];
    window.criteo_q.push(
      { event: 'setAccount', account: 22904 },
      { event: 'setHashedEmail', email: AppActions.getUser().invitation_code },
      { event: 'setSiteType', type: 'mobile' },
      { event: 'viewList', item: this.productIdList });
    Track.ecAddImpression(this.state.data, this.state.isSearch ? 'Search' : 'ProductList');
  }
  componentWillReceiveProps(nextProps){
    this.state.data = nextProps.data
    this.state.tab = AppActions.getUrlParam().index  || 0;
    Track.ecAddImpression(this.state.data, this.state.isSearch ? 'Search' : 'ProductList');
  }
  taxonChild() {
    let width = 0;
    let wrap = document.getElementById('taxons');
    if(wrap) {
      let dom = wrap.childNodes || [];
      for(let i in dom) {
        if(dom[i].nodeType === 1) {
          width += dom[i].offsetWidth;
        }
      }
      this.setState({
        wid: width + 1,
        tab_wrap: wrap.offsetWidth < width ? 'show' : ''
      })
    }
  }
  reload() {
    location.reload();
  }
  searchSubmit(event) {
    event.preventDefault();
    fbq('track', 'Search');
    AppActions.navigateTo('/productlist?keyword=' +  this.state.searchKey + '&page=1&per_page=20');

  }
  changeVal(event){
    this.state.searchKey = event.target.value
    this.setState(this.state);
  }
  prodTab(id, index) {
    AppActions.navigateTo('/productlist?taxon_id=' + id +'&index=' + index);
  }
  handleClick(i, e){
    e.preventDefault();
    Track.ecProdClick(this.state.data.products[i], this.state.isSearch ? 'Search' : 'ProductList');
    Link.handleClick(e);
  }
  go(){
    var index = this.state.data.current_page + 1;

    //AppActions.navigateTo('/productlist?keyword=' +  this.state.searchKey + '&page=' + index + '&per_page=20');

    AppActions.getData('get', '/api/products/search?keyword='  +  this.state.searchKey + '&page=' + index + '&per_page=20', (json) => {
      //this.props.data.products = json;
      //this.props.data.current_page = json.current_page;
      this.state.data.products = this.state.data.products.concat(json.products);
      this.state.data.current_page = json.current_page;
      this.setState(this.state);
    })
  }
  render() {
    let title = 'Products - Anker';
    this.context.onSetTitle(title);
    return (
      <div className="Product">
        <div className="Product-container">
          {this.state.isSearch ?
            <div className="search">
              Search:<input type="input" onChange={this.changeVal.bind(this)} value={decodeURI(this.state.searchKey)} />
              <a onClick={this.searchSubmit.bind(this)}><i className="iconfont">&#xe618;</i></a>
            </div> :'' }
          {this.state.data.child_taxons ?
            <div className="child-taxon">
              <ul id="taxons" style={{width: this.state.wid}}>
                {this.state.data.child_taxons.map(function(item, i) {
                  return (
                    <li className={this.state.tab == i ? 'cur' : ''}>
                      <a onClick={this.prodTab.bind(this, item.id, i)} className="taxon">{item.name}</a>
                    </li>
                  );
                }, this)}
              </ul>
            </div> : '' }
          {(this.state.data.products && this.state.data.products.length > 0) ? <i className={"iconfont sright " + this.state.tab_wrap}>&#xe613;</i> : ''}
          <div className="prod-list ui-flex">
            {(this.state.data.products && this.state.data.products.length > 0) ? this.state.data.products.map(function(item, i) {
              this.productIdList.push(item.id);
              return (
                <a href={'/productpage?id=' + item.id} className="prod-item cell-6 ui-flex" key={item.id} onClick={this.handleClick.bind(this, i)}>
                  <div className="prod-item-img">
                    <img src={ (item.variants.length > 0 && item.variants[0].images.length > 0) ? item.variants[0].images[0].product_url : ''} />
                  </div>
                  <ul className="prod-item-attr">
                    {item.variants.map(function(item) {
                      return (
                        <li>
                        {(item.option_values.length > 0) ?
                          <img title={item.option_values[0].name} src={item.option_values[0].image.normal_url} />
                          : ''}
                        </li>
                      );
                    }, this)}
                  </ul>
                  <div className="prod-item-title">{item.name}</div>
                  <div className="prod-item-price">{item.variants[0] ? item.variants[0].display_price : ''}</div>
                </a>
              );
            },this) :
            <div className="noData" style={{'minHeight': this.state.screenH}}>
              <div>
                <i className="iconfont" onClick={this.reload.bind(this)}>&#xe63c;</i>
                <p>Sorry, we couldn’t find anything. <br/>Please search again.</p>
              </div>
            </div>}
          </div>
          {
            this.state.data.pages > parseInt(this.state.data.current_page) ?
            <div className="pager"><i className="iconfont" onClick={this.go.bind(this)}>&#xe645;</i></div>:""
          }
        </div>
      </div>
    );
  }
}

export default ProductList;