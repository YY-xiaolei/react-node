/**
 * Created by shady on 15/7/7.
 */

import React, { PropTypes } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './AboutPage.less';

@withStyles(styles)
class AboutPage {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  render() {
    let title = 'About Us - Anker';
    this.context.onSetTitle(title);
    return (
      <div className="AboutPage">
        <div className="title">
          <h2>Who We Are</h2>
        </div>
        <div className="content">
          <p>We’re Anker, a multinational team of techies committed to powering the lives of people everywhere.</p>
          <p>We were founded back in 2009 by our CEO, Steven Yang. His goal was to improve and simplify the technology we use and rely on every day. </p>
          <p>Fast forward a few years and we’ve become America’s leading USB charging brand, setting the industry standard for mobile device accessories.</p>
          <p>We create a world where the mobile life is truly mobile—a world where boundaries are defined by you, not by the location of the nearest electrical outlet.</p>
          <p>We’re Anker. We power your mobile life.</p>
        </div>
      </div>
    );
  }

}

export default AboutPage;
