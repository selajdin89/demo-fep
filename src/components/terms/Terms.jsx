import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Terms.scss";

const Terms = () => {
	const navigate = useNavigate();

	return (
		<div className="terms">
			{/* Back Button */}
			<div className="back-button" onClick={() => navigate("/")}>
				<FaArrowLeft className="arrow-icon" />
			</div>

			<h1>Terms and Conditions</h1>

			<h2>Eligibility</h2>
			<p>
				Our Website is intended for users who are 18 years or older and are
				eligible to enter into a legally binding contract with us and not be
				barred from doing so under any applicable laws; or for users who are 13
				years or older and have parental or guardian consent to the Agreement.
				By using the Website, you affirm that you meet the eligibility
				requirements.
			</p>

			<h2>Intellectual Property</h2>
			<p>
				All content available through the Website, including text, graphics,
				logos, software, music, videos, sounds, and photographs, is protected by
				copyright, trademarks, patents, or other proprietary rights. Final
				Expense Plan grants a non-exclusive, non-sublicensable,
				non-transferable, revocable, limited license to view, copy, and print
				content for personal, non-commercial use. Any rights not expressly
				granted are reserved.
			</p>
			<p>Users may not:</p>
			<ul>
				<li>Store, transmit, or upload malicious files.</li>
				<li>
					Attempt to determine source code or disrupt Website functionality.
				</li>
				<li>Remove proprietary notices from Website content.</li>
				<li>Use automated scripts to collect data from the Website.</li>
				<li>
					Modify, reverse-engineer, or create derivative works from the Website.
				</li>
			</ul>

			<h2>Links to Third-Party Websites</h2>
			<p>
				Our Website may contain links to third-party websites. We do not verify
				the identity, security, or content of these third-party websites and are
				not responsible for any issues that may arise from using them. Any
				interaction with third-party sites is at the user&apos;s own risk.
			</p>

			<h2>Deals and Offers</h2>
			<p>
				Users may be required to share personal information to access certain
				deals, giveaways, or promotions available through the Website. Final
				Expense Plan does not guarantee the availability, accuracy, or
				fulfillment of these offers, as they are managed by third parties.
			</p>

			<h2>Disclaimer of Warranties</h2>
			<p>
				The Website is provided &quot;as is&quot; and &quot;as available&quot;
				without warranties of any kind. Final Expense Plan does not guarantee
				that:
			</p>
			<ul>
				<li>The Website will be available without interruptions.</li>
				<li>The Website will be free of errors or viruses.</li>
				<li>The Website will meet user expectations.</li>
			</ul>
			<p>Users assume all risks associated with using the Website.</p>

			<h2>Limitation of Liability</h2>
			<p>
				Final Expense Plan, its affiliates, and partners shall not be liable for
				any direct, indirect, incidental, special, or consequential damages
				arising from the use or inability to use the Website.
			</p>

			<h2>Indemnification</h2>
			<p>
				Users agree to indemnify and hold Final Expense Plan harmless from any
				claims, damages, or legal actions resulting from their use of the
				Website, including any violation of these Terms and Conditions.
			</p>

			<h2>Modifications to the Agreement</h2>
			<p>
				Final Expense Plan reserves the right to update these Terms and
				Conditions at any time. Users are encouraged to review them regularly.
				Continued use of the Website constitutes acceptance of any
				modifications.
			</p>

			<h2>Contact Us</h2>
			<p>
				For any questions or concerns regarding these Terms and Conditions,
				contact us at:{" "}
				<a href="mailto:contact@finalexpenseplan.com">
					contact@finalexpenseplan.com
				</a>
				.
			</p>
		</div>
	);
};

export default Terms;
