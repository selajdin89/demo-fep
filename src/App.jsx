import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Terms from "./components/terms/Terms";
import PrivacyPolicy from "./components/terms/PrivacyPolicy";
import FormPage from "./components/formPage/FormPage";

function App() {
	return (
		<Router>
			<div>
				<Routes>
					{/* Main Form Page */}
					<Route path="/" element={<FormPage />} />

					{/* Terms & Conditions Page */}
					<Route path="/terms" element={<Terms />} />

					{/* Privacy Policy Page */}
					<Route path="/privacy" element={<PrivacyPolicy />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
