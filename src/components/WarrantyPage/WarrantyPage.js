/**
 * Created by shady on 15/7/7.
 */

import React, { PropTypes } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './WarrantyPage.less';

@withStyles(styles)
class WarrantyPage {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  render() {
    let title = 'Warranty - Anker';
    this.context.onSetTitle(title);
    return (
      <div className="WarrantyPage">
        <div className="title">
          <h2>Warranty</h2>
          <center>Learn about our hassle-free 18-month warranty.</center>
        </div>
        <div className="content">
          <div>
            <h4 className="WarrantyPage-title">  30-Day Money-Back Guarantee for Any Reason</h4>
            <p className="">  You may return your undamaged product and packaging within 30 days of purchase to receive a FULL REFUND for any reason. If the reason for return isn’t quality-related, the customer must pay the return shipping costs.</p>
          </div>
          <div>
            <h4 className="WarrantyPage-title">18-Month Warranty for Quality-Related Issues</h4>
            <div>
              <h5>● Requests within country of purchase</h5>
              <p>We will take care of all quality-related issues with a REPLACEMENT or FULL REFUND including any return shipping costs. Please note: Any provided shipping labels must be used within 20 days of purchase.</p>
            </div>
            <div>
              <h5>● Requests from outside country of purchase</h5>
              <p>We will take care of all quality-related issues with a FULL REFUND or REPLACEMENT. International shipping costs must be covered by the customer. If the item cannot be returned then we will offer a 50% REFUND.</p>
            </div>
            <div>
                <h5>● Requests for orders shipped internationally</h5>
                <p>We will take care of all quality-related issues with a FULL REFUND including any return shipping costs. This includes purchases shipped overseas from the USA via Amazon or eBay.</p>
            </div>
          </div>
          <div>
            <h4 className="WarrantyPage-title">For purchases made through other retailers:</h4>
            <p>Other retailers’ after-sales support policies will vary. Please contact the retailer directly for specific guidance on their warranty process.</p>
            <p>Unauthorized reselling of Anker products is strictly prohibited.</p>
          </div>
          <div>
            <h3>FAQs:</h3>
            <h4>1. What isn’t covered by the warranty?</h4>
            <p>● Purchases from unauthorized resellers</p>
            <p>● Improperly operated devices</p>
            <p>● Lost or stolen products</p>
            <p>● Purchases made over 18 months ago (unless otherwise stated)</p>
            <p>● Non quality-related issues (after 30 days of purchase)</p>
            <p>● Free products</p>
            <h4>2. When does the warranty begin?</h4>
            <p>It begins the day you place your order.</p>
            <h4>3. How do I claim the warranty?</h4>
            <p>Before submitting a warranty claim, please refer to the specific FAQs for your product and attempt all troubleshooting suggestions.</p>
            <p>If you believe the item is defective and under warranty, please submit a Return or Exchange request on the product’s support page, or contact us at  <a href='Mailto:support@anker.com'>support@anker.com</a></p>
            <h4>4. What is a valid proof of purchase?</h4>
            <p>● An Amazon order number or eBay username for a purchase made through AnkerDirect</p>
            <p>● A dated sales receipt from an authorized Anker Reseller that shows a description of the product along with its price</p>
            <h4>5. What if I don’t have any proof of purchase?</h4>
            <p>● If you made your purchase through AnkerDirect, we may be able to locate your order using your email address, name or shipping address.</p>
            <p>● If you made your purchase through an authorized Anker Reseller, you may contact the Reseller to see if they can provide a copy of your receipt.</p>
            <p>● If the product was a gift, you may ask the giver to provide you with a copy of the receipt or claim the warranty on your behalf.</p>
            <h4>6. Will the warranty be renewed if my product is replaced?</h4>
            <p>The warranty continues from the date of your original purchase. It won’t be renewed after a replacement has been provided.</p>
            <h4>7. Who are authorized Anker Retailers and Resellers?</h4>
            <p>Our major authorized Retailers and Resellers are Newegg, Staples, Walmart.com and Amazon.com LLC. For more information, please contact us at  <a href='Mailto:support@anker.com'>support@anker.com</a></p>
          </div>
        </div>
      </div>
    );
  }

}

export default WarrantyPage;
