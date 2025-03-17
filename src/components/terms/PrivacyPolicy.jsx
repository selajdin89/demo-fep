import { FaArrowLeft } from "react-icons/fa";
import "./PrivacyPolicy.scss";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
	const navigate = useNavigate();
	return (
		<div className="privacy-policy">
			<div className="back-button" onClick={() => navigate("/")}>
				<FaArrowLeft className="arrow-icon" />
			</div>
			<h1>Privacy Policy</h1>

			<h2>Scope of the Policy</h2>
			<p>
				This policy applies to all visitors to Final Expense Plan&apos;s website
				and encompasses all services including apps, websites, features, and
				other services offered. Your use of our website also aligns with our
				Terms and Conditions.
			</p>

			<h2>Information We Collect</h2>
			<p>
				We collect information you provide directly on our website and
				indirectly through your interactions with us. This includes personal
				details like your name, email, and demographic information, as well as
				usage data such as IP addresses and cookies.
			</p>

			<h2>How We Use Your Information</h2>
			<p>
				Your information helps us improve our services, communicate with you,
				support your needs, prevent fraud, and comply with legal obligations. We
				may also use your data for marketing purposes with your consent.
			</p>

			<h2>Sharing of Information</h2>
			<p>
				Information may be shared with third-party service providers to help us
				operate the website, conduct our business, or serve our users, as long
				as those parties agree to keep this information confidential. We also
				share information when it&apos;s legally required.
			</p>

			<h2>Data Security</h2>
			<p>
				We take data security seriously and implement appropriate measures to
				protect your personal information.
			</p>

			<h2>Your Rights</h2>
			<p>
				You can review, change, or delete your personal information at any time
				by contacting us.
			</p>

			<h2>Changes to This Policy</h2>
			<p>
				We may update this privacy policy to reflect changes to our information
				practices. Any changes will be posted on this page.
			</p>

			<h2>Contact Us</h2>
			<p>
				For more information about our privacy practices, if you have questions,
				or if you would like to make a complaint, please contact us by email at{" "}
				<a href="mailto:contact@finalexpenseplan.com">
					contact@finalexpenseplan.com
				</a>{" "}
				or by mail using the details provided below.
			</p>

			<p>
				This privacy policy has been simplified and stripped of state-specific
				legal details for broad applicability and ease of understanding.
			</p>
		</div>
	);
};

export default PrivacyPolicy;
