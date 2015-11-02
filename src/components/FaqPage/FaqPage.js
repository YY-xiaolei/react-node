/**
 * Created by shady on 15/7/7.
 */

import React, { PropTypes } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './FaqPage.less';

@withStyles(styles)
class FaqPage {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  render() {
    let title = 'FAQ';
    this.context.onSetTitle(title);
    return (
      <div className="FaqPage">
        <p className="Faq_ask">  Can you charge th battery and a phone simultaneously by connecting them in series?</p>
        <p className="Faq_Answer">  A:No,Our Astro 2nd Gen batteries cannot be charged and disCharged at the same time protection of the bat-tery.</p>
        <p className="Faq_ask">  Can you charge th battery and a phone simultaneously by connecting them in series?</p>
        <p className="Faq_Answer">  A:No,Our Astro 2nd Gen batteries cannot be charged and disCharged at the same time protection of the bat-tery.</p>
        <p className="Faq_ask">  Can you charge th battery and a phone simultaneously by connecting them in series?</p>
        <p className="Faq_Answer">  A:No,Our Astro 2nd Gen batteries cannot be charged and disCharged at the same time protection of the bat-tery.</p>
        <p className="Faq_ask">  Can you charge th battery and a phone simultaneously by connecting them in series?</p>
        <p className="Faq_Answer">  A:No,Our Astro 2nd Gen batteries cannot be charged and disCharged at the same time protection of the bat-tery.</p>
        <p className="Faq_ask">  Can you charge th battery and a phone simultaneously by connecting them in series?</p>
        <p className="Faq_Answer">  A:No,Our Astro 2nd Gen batteries cannot be charged and disCharged at the same time protection of the bat-tery.</p>
      </div>
    );
  }

}

export default FaqPage;
