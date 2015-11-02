/**
 * Created by shady on 15/7/7.
 */

import React, { PropTypes } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './TermOfService.less';

@withStyles(styles)
class TermOfService {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  render() {
    let title = 'Terms of Use - Anker';
    this.context.onSetTitle(title);
    return (
      <div className="TermOfService">
          <div className="title">
            <h2>Terms of Use</h2>
            <center>Legal guidelines for using anker.com</center>
          </div>
          <div className="content">
            <h3>Introduction</h3>
            <p>These Terms of Use govern your use of this website. By using this website, you accept these Terms of Use in full. If you disagree with these Terms of Use or any part of these Terms of Use, you must not use this website. </p>
            <p>This website uses cookies. By using this website and agreeing to these Terms of Use, you consent to anker.com's use of cookies in accordance with the terms of anker.com's Privacy Policy.</p>
            <h3>License to Use Website</h3>
            <p>Unless otherwise stated, anker.com and / or its licensors own the intellectual property rights in the website and material on the website. Subject to the license below, all these intellectual property rights are reserved.</p>
            <p>You may view, download (for caching purposes only), and print pages, user manuals, or other product information from the website for your own personal use, subject to the restrictions set out below and elsewhere in these Terms of Use.</p>
            <h4>You must not:</h4>
            <p>● Republish material from this website (including republication on another website), sell, rent or sub-license material from the website</p>
            <p>● Show any material from the website in public</p>
            <p>● Reproduce, duplicate, copy or otherwise exploit material on this website for a commercial purpose</p>
            <p>● Edit or otherwise modify any material on the website</p>
            <p>● Redistribute material from this website except for content specifically and expressly made available for redistribution</p>
            <h3>Acceptable Use</h3>
            <p>You must not use this website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website, or in any way which is unlawful, illegal, fraudulent or harmful, or in connection with any unlawful, illegal, fraudulent or harmful purpose or activity.</p>
            <p>You must not use this website to copy, store, host, transmit, send, use, publish or distribute any material which consists of (or is linked to) any spyware, computer virus, Trojan horse, worm, keystroke logger, rootkit or other malicious computer software.</p>
            <p>You must not conduct any systematic or automated data collection activities (including without limitation scraping, data mining, data extraction and data harvesting) on or in relation to this website without anker.com's express written consent.</p>
            <p>You must not use this website to transmit or send unsolicited commercial communications.</p>
            <p>You must not use this website for any purposes related to marketing without anker.com's express written consent.</p>
            <h3>User Content</h3>
            <p>In these Terms of Use, "your user content" means material (including without limitation text, images, audio material, video material and audio-visual material) that you submit to this website, for whatever purpose.</p>
            <p>You grant to anker.com a worldwide, irrevocable, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate and distribute your user content in any existing or future media. You also grant to anker.com the right to sub-license these rights, and the right to bring an action for infringement of these rights. </p>
            <p>Your user content must not be illegal or unlawful, must not infringe any third party's legal rights, and must not be capable of giving rise to legal action whether against you or anker.com or a third party (in each case under any applicable law).</p>
            <p>You must not submit any user content to the website that is or has ever been the subject of any threatened or actual legal proceedings or other similar complaint. </p>
            <p>anker.com reserves the right to edit or remove any material submitted to this website, or stored on anker.com's servers, or hosted or published upon this website.</p>
            <p>Notwithstanding anker.com's rights under these Terms of Use in relation to user content, anker.com does not undertake to monitor the submission of such content to, or the publication of such content on, this website.</p>
            <h3>No Warranties</h3>
            <p>This website is provided "as is" without any representations or warranties, express or implied. anker.com makes no representations or warranties in relation to this website or the information and materials provided on this website. </p>
            <p>Without prejudice to the generality of the foregoing paragraph, anker.com does not warrant that:</p>
            <p>● This website will be constantly available, or available at all; or </p>
            <p>● The information on this website is complete, true, accurate or non-misleading. </p>
            <p>Nothing on this website constitutes, or is meant to constitute, advice of any kind. If you require advice in relation to any legal, financial or medical matter you should consult an appropriate professional.</p>
            <h3>Limitations of Liability</h3>
            <p>anker.com will not be liable to you (whether under the law of contact, the law of torts or otherwise) in relation to the contents of, or use of, or otherwise in connection with, this website: </p>
            <p>● To the extent that the website is provided free-of-charge, for any direct loss</p>
            <p>● For any indirect, special or consequential loss</p>
            <p>● For any business losses, loss of revenue, income, profits or anticipated savings, loss of contracts or business relationships, loss of reputation or goodwill, or loss or corruption of information or data.</p>
            <p>These limitations of liability apply even if anker.com has been expressly advised of the potential loss.</p>
            <h3>Exceptions</h3>
            <p>Nothing in this website disclaimer will exclude or limit any warranty implied by law that it would be unlawful to exclude or limit, and nothing in this website disclaimer will exclude or limit anker.com's liability in respect of any:</p>
            <p>● Death or personal injury caused by anker.com's negligence</p>
            <p>● Fraud or fraudulent misrepresentation on the part of anker.com</p>
            <p>● Matter which it would be illegal or unlawful for anker.com to exclude or limit, or to attempt or purport to exclude or limit, its liability.</p>
            <h3>Reasonableness</h3>
            <p>By using this website, you agree that the exclusions and limitations of liability set out in this website disclaimer are reasonable. </p>
            <p>If you do not think they are reasonable, you must not use this website.</p>
            <h3>Other Parties</h3>
            <p>You accept that, as a limited liability entity, anker.com has an interest in limiting the personal liability of its officers and employees. You agree that you will not bring any claim personally against anker.com's officers or employees in respect of any losses you suffer in connection with the website.</p>
            <p>Without prejudice to the foregoing paragraph, you agree that the limitations of warranties and liability set out in this website disclaimer will protect anker.com's officers, employees, agents, subsidiaries, successors, assigns and sub-contractors as well as anker.com</p>
            <h3>Unenforceable Provisions</h3>
            <p>If any provision of this website disclaimer is, or is found to be, unenforceable under applicable law, that will not affect the enforceability of the other provisions of this website disclaimer.</p>
            <h3>Indemnity</h3>
            <p>You hereby indemnify anker.com and undertake to keep anker.com indemnified against any losses, damages, costs, liabilities and expenses (including without limitation legal expenses and any amounts paid by anker.com to a third party in settlement of a claim or dispute on the advice of anker.com's legal advisers) incurred or suffered by anker.com arising out of any breach by you of any provision of these Terms of Use, or arising out of any claim that you have breached any provision of these Terms of Use.</p>
            <h3>Breaches</h3>
            <p>Without prejudice to anker.com's other rights under these Terms of Use, if you breach these Terms of Use in any way, anker.com may take such action as anker.com deems appropriate to deal with the breach, including suspending your access to the website, prohibiting you from accessing the website, blocking computers using your IP address from accessing the website, contacting your internet service provider to request that they block your access to the website and/or bringing court proceedings against you.</p>
            <h3>Assignment</h3>
            <p>anker.com may transfer, sub-contract or otherwise deal with anker.com's rights and/or obligations under these Terms of Use without notifying you or obtaining your consent. You may not transfer, sub-contract or otherwise deal with your rights and/or obligations under these Terms of Use.</p>
            <h3>Severability</h3>
            <p>If a provision of these Terms of Use is determined by any court or other competent authority to be unlawful and/or unenforceable, the other provisions will continue in effect. If any unlawful and/or unenforceable provision would be lawful or enforceable if part of it were deleted, that part will be deemed to be deleted, and the rest of the provision will continue in effect.</p>
            <h3>Entire Agreement</h3>
            <p>These Terms of Use, together with anker.com's Privacy Policy, constitute the entire agreement between you and anker.com in relation to your use of this website, and supersede all previous agreements in respect of your use of this website.</p>
            <h3>Law and Jurisdiction</h3>
            <p>These Terms of Use will be governed by and construed in accordance with US law, and any disputes relating to these Terms of Use will be subject to the exclusive jurisdiction of the courts of California.</p>
            <h3>Changes to Our Terms of Use</h3>
            <p>If we decide to change our Terms of Use, we will update the Terms of Use modification date below.</p>
            <p>Last Modified: 9/5/2013</p>
            <h3>Contact Us</h3>
            <p>If you have any questions about our Terms of Use, please contact us at <a href="Mailto:support@anker.com">support@anker.com</a></p>
          </div>
        </div>
    );
  }

}

export default TermOfService;
