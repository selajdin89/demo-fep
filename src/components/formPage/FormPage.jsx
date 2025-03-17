import React, { useEffect, useState } from "react";
import {
	Form,
	Input,
	Button,
	Radio,
	Row,
	Col,
	DatePicker,
	Slider,
	Select,
	Checkbox,
	Grid,
} from "antd";
import { IoIosArrowForward } from "react-icons/io";
import moment from "moment";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import telegramIcon from "../../assets/images/telegram.png";
import logo from "../../assets/images/fep-logo.png";
import arrowDown from "../../assets/images/arrow_drop_down.png";
import "./FormPage.scss";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";

dayjs.extend(customParseFormat);

const DateOfBirthInput = ({ value, onChange }) => {
	const [year, setYear] = useState(value ? dayjs(value).year() : null);
	const [month, setMonth] = useState(value ? dayjs(value).month() + 1 : null); // Months are 0-indexed in dayjs
	const [day, setDay] = useState(value ? dayjs(value).date() : null);

	const handleYearChange = (date) => {
		const newYear = date ? date.year() : null;
		setYear(newYear);
		updateDate(newYear, month, day);
	};

	const handleMonthChange = (date) => {
		const newMonth = date ? date.month() + 1 : null; // Months are 0-indexed in dayjs
		setMonth(newMonth);
		updateDate(year, newMonth, day);
	};

	const handleDayChange = (date) => {
		const newDay = date ? date.date() : null;
		setDay(newDay);
		updateDate(year, month, newDay);
	};

	const updateDate = (year, month, day) => {
		if (year && month && day) {
			const dateString = `${year}-${month.toString().padStart(2, "0")}-${day
				.toString()
				.padStart(2, "0")}`;
			onChange(dayjs(dateString, "YYYY-MM-DD"));
		} else {
			onChange(null);
		}
	};

	return (
		<Row gutter={8}>
			<Col span={8}>
				<DatePicker
					picker="year"
					placeholder="YYYY"
					value={year ? dayjs().set("year", year) : null} // Only set the year
					onChange={handleYearChange}
					style={{ width: "100%" }}
				/>
			</Col>
			<Col span={8}>
				<DatePicker
					picker="month"
					placeholder="MM"
					value={month ? dayjs().set("month", month - 1) : null} // Only set the month
					onChange={handleMonthChange}
					style={{ width: "100%" }}
					format="MM" // Display only the month
				/>
			</Col>
			<Col span={8}>
				<DatePicker
					picker="date"
					placeholder="DD"
					value={day ? dayjs().set("date", day) : null} // Only set the day
					onChange={handleDayChange}
					style={{ width: "100%" }}
					format="DD" // Display only the day
				/>
			</Col>
		</Row>
	);
};

const validateDateOfBirth = (_, value) => {
	// if (!value) {
	// 	return Promise.reject("Please enter your date of birth");
	// }

	// Parse the date string into a dayjs object
	const date = dayjs(value, "YYYY-MM-DD", true); // Use strict parsing

	// Check if the date is valid
	if (!date.isValid()) {
		return Promise.reject("Invalid date format (YYYY-MM-DD)");
	}

	// Validate the year
	const year = date.year();
	const currentYear = dayjs().year();
	if (year < 1900 || year > currentYear) {
		return Promise.reject(`Year must be between 1900 and ${currentYear}`);
	}

	// Validate the month
	const month = date.month() + 1; // dayjs months are 0-indexed
	if (month < 1 || month > 12) {
		return Promise.reject("Month must be between 01 and 12");
	}

	// Validate the day
	const day = date.date();
	if (day < 1 || day > 31) {
		return Promise.reject("Day must be between 01 and 31");
	}

	// Validate specific invalid dates (e.g., 31/02/2023)
	if (date.date() !== day) {
		return Promise.reject("Invalid date (e.g., 31/02/2023 is not valid)");
	}

	// If all validations pass
	return Promise.resolve();
};

const selectInputStyle = {
	height: "47px",
	borderRadius: "3.7px",
};

const FormPage = () => {
	const [form] = Form.useForm();
	const values = Form.useWatch([], form);
	const [isPhoneInputFocused, setIsPhoneInputFocused] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [currentScreen, setCurrentScreen] = useState(1);
	const [isScreenValid, setIsScreenValid] = useState(false);

	console.log(isScreenValid);
	// Define the fields for each screen
	const screenFields = {
		1: ["firstName", "lastName", "phone", "email"], // Fields for screen 1
		2: ["dob", "gender"], // Fields for screen 2
		3: ["coverage"], // Fields for screen 3
		4: ["address", "city"], // Fields for screen 4
		5: ["province", "postalCode", "terms"], // Fields for screen 5
	};

	const saveFormData = () => {
		const formData = form.getFieldsValue(); // Get all form data
		const savedData = JSON.parse(sessionStorage.getItem("formData")) || {}; // Retrieve existing saved data
		const mergedData = { ...savedData, ...formData }; // Merge new data with existing data
		sessionStorage.setItem("formData", JSON.stringify(mergedData)); // Save merged data
		sessionStorage.setItem("currentScreen", currentScreen.toString()); // Save current screen
	};

	useEffect(() => {
		if (currentScreen === 5) {
			const savedData = sessionStorage.getItem("formData");
			if (savedData) {
				form.setFieldsValue(JSON.parse(savedData)); // Load saved data
			}
		}
	}, [currentScreen]); // Trigger only when currentScreen changes

	// Retrieve form data from sessionStorage
	const loadFormData = () => {
		const savedData = sessionStorage.getItem("formData");
		const savedScreen = sessionStorage.getItem("currentScreen");
		if (savedData) {
			form.setFieldsValue(JSON.parse(savedData));
		}
		if (savedScreen) {
			setCurrentScreen(parseInt(savedScreen, 10));
		}
	};

	// Clear sessionStorage on page reload
	useEffect(() => {
		const handleBeforeUnload = () => {
			sessionStorage.removeItem("formData");
			sessionStorage.removeItem("currentScreen");
		};

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, []);

	// Load form data when the component mounts
	useEffect(() => {
		loadFormData();
	}, []);

	// Handle next screen navigation
	const handleNextScreen = () => {
		form
			.validateFields(screenFields[currentScreen])
			.then(() => {
				saveFormData(); // Save form data before navigating
				setIsScreenValid(true);
				setCurrentScreen((prev) => prev + 1);
			})
			.catch(() => {
				setIsScreenValid(false);
			});
	};
	const onFinish = (values) => {
		console.log(values, "clicked");

		// Retrieve saved form data from sessionStorage
		const savedData = JSON.parse(sessionStorage.getItem("formData")) || {};

		// Combine saved data with the current screen's data
		const allFormData = { ...savedData, ...values };

		console.log("All form data:", allFormData); // Debugging: Check the combined data

		setIsSubmitting(true);

		// Send email using EmailJS
		emailjs
			.send(
				"service_vk3pz3g", // Replace with your EmailJS Service ID
				"template_kangvxy", // Replace with your EmailJS Template ID
				allFormData, // Send all form data
				"U6Ss_7DTyU7bO_pgE" // Replace with your EmailJS Public Key
			)
			.then(
				(response) => {
					console.log("Email sent successfully!", response);
					setIsSubmitting(false);
					setIsSubmitted(true);
					sessionStorage.removeItem("formData"); // Clear saved data after submission
				},
				(error) => {
					console.error("Failed to send email:", error);
					setIsSubmitting(false);
				}
			);
	};

	useEffect(() => {
		form
			.validateFields({
				validateOnly: true,
			})
			.then(() => {
				setIsScreenValid(true);
			});
	}, [form, values]);

	// Handle previous screen navigation
	const handlePreviousScreen = () => {
		setCurrentScreen((prev) => prev - 1);
	};

	const formatPhoneNumber = (value) => {
		if (!value) return "+1";
		let phoneNumber = value.replace(/\D/g, "");
		if (!phoneNumber.startsWith("1")) {
			phoneNumber = "1" + phoneNumber;
		}
		if (phoneNumber.length > 1) {
			return `+1 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(
				4,
				7
			)}-${phoneNumber.slice(7, 11)}`;
		}
		return `+1`;
	};

	useEffect(() => {
		setIsScreenValid(false);
	}, [currentScreen]);

	useEffect(() => {
		form.setFieldsValue({ phone: "+1" });
	}, [form]);

	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
	};

	const GenderButtonGroup = ({ value, onChange }) => {
		return (
			<div className="gender-container">
				<Button
					className="gender-input"
					style={selectInputStyle}
					type={value === "male" ? "primary" : "default"}
					onClick={() => onChange("male")}
				>
					Male
				</Button>
				<Button
					className="gender-input"
					style={selectInputStyle}
					type={value === "female" ? "primary" : "default"}
					onClick={() => onChange("female")}
				>
					Female
				</Button>
			</div>
		);
	};
	const { useBreakpoint } = Grid;
	const screens = useBreakpoint();

	const spanValue = screens.lg || screens.xl ? 12 : 16;
	// const isLabelWrapp = screens.xs ? true : false;
	// console.log(isLabelWrapp);
	return (
		<div className="form-page">
			<div className="left-section">
				<div className="logo">
					<img src={logo} alt="Logo" />
				</div>
				<h1 className="title">
					Secure your <br /> final expenses <br /> coverage
				</h1>
			</div>

			<div className="right-section">
				<div className="form-container">
					<div className="logo-title">
						<div className="mobile-logo">
							<img src={logo} alt="Logo" />
						</div>
						<h3>
							Sign Up for Final <br /> Expense Plan
						</h3>
					</div>
					<p>Secure your loved ones' future with Final br Expense Insurance</p>
					{isSubmitted ? (
						<div className="success-message">
							<h2>Thank you for signing up!</h2>
							<p>
								Your information has been successfully submitted. We will
								contact you shortly to discuss your final expense plan.
							</p>
						</div>
					) : (
						<div style={{ flex: 1 }}>
							<Form
								form={form}
								requiredMark={false}
								onFinish={onFinish}
								onFinishFailed={onFinishFailed}
								wrapperCol={{
									span: spanValue,
								}}
								labelWrap
							>
								<div className="inputs">
									<AnimatePresence mode="wait">
										{currentScreen === 1 && (
											<motion.div
												key="first-screen"
												initial={{ x: 0, opacity: 1 }}
												animate={{ x: 0, opacity: 1 }}
												exit={{ x: "-50%", opacity: 0 }}
												transition={{ duration: 0.3 }}
												className="first-screen"
											>
												<Form.Item
													className="custom-label"
													form={form}
													label="What is your First Name?"
													name="firstName"
													rules={[
														{
															required: true,
															message: "Please enter your first name",
														},
													]}
												>
													<Input placeholder="Type Your First Name" />
												</Form.Item>

												<Form.Item
													className="custom-label"
													label="What is your Last Name?"
													name="lastName"
													rules={[
														{
															required: true,
															message: "Please enter your last name",
														},
													]}
												>
													<Input placeholder="Type Your Last Name" />
												</Form.Item>

												<Form.Item
													className="custom-label"
													label="What is your Phone number?"
													name="phone"
													rules={[
														{
															required: true,
															message: "Please enter your phone number",
														},
														{
															pattern: /^\+1 \(\d{3}\) \d{3}-\d{4}$/,
															message:
																"Please enter a valid phone number in the format +1 (***) ***-****",
														},
													]}
												>
													<Input
														placeholder={
															isPhoneInputFocused
																? "Type your phone number here"
																: "+1 (***) ***-****"
														}
														value={form.getFieldValue("phone")}
														onChange={(e) => {
															const digitsOnly = e.target.value.replace(
																/\D/g,
																""
															);
															const formattedValue =
																formatPhoneNumber(digitsOnly);
															form.setFieldsValue({ phone: formattedValue });
														}}
														onFocus={() => setIsPhoneInputFocused(true)}
														onBlur={() => setIsPhoneInputFocused(false)}
														inputMode="numeric"
													/>
												</Form.Item>

												<Form.Item
													className="custom-label"
													label="What is your email?"
													name="email"
													rules={[
														{
															required: true,
															message: "Please enter your email",
														},
														{
															type: "email",
															message: "Please enter a valid email",
														},
													]}
												>
													<Input placeholder="Type your email here" />
												</Form.Item>
											</motion.div>
										)}
										{currentScreen === 2 && (
											<motion.div
												key="second-screen"
												initial={{ x: 0, opacity: 1 }}
												animate={{ x: 0, opacity: 1 }}
												exit={{ x: "-50%", opacity: 0 }}
												transition={{ duration: 0.3 }}
												className="first-screen"
											>
												<Form.Item
													className="custom-label"
													label="Are you a male or a female?"
													name="gender"
													rules={[
														{
															required: true,
															message: "Please select your gender",
														},
													]}
												>
													<GenderButtonGroup />
												</Form.Item>

												<Form.Item
													className="custom-label"
													label="Date of Birth"
													name="dob"
													rules={[
														{
															required: true,
															message: "Please enter your date of birth",
														},
														{
															validator: validateDateOfBirth, // Use custom validation
														},
													]}
												>
													<DateOfBirthInput />
												</Form.Item>
											</motion.div>
										)}
										{currentScreen === 3 && (
											<motion.div
												key="third-screen"
												initial={{ x: 0, opacity: 1 }}
												animate={{ x: 0, opacity: 1 }}
												exit={{ x: "-50%", opacity: 0 }}
												transition={{ duration: 0.3 }}
												className="third-screen"
											>
												<Form.Item
													wrapperCol={{
														span: 24,
													}}
													layout="vertical"
													label="What Level of Coverage Would You Like"
													name="coverage"
												>
													<Slider
														min={0}
														max={50000}
														step={1000}
														marks={{ 0: "0", 50000: "50,000" }}
														tooltip={{ formatter: (value) => `$${value}` }}
														dots={false}
														included={false}
													/>
												</Form.Item>
											</motion.div>
										)}
										{currentScreen === 4 && (
											<motion.div
												key="fourth-screen"
												initial={{ x: 0, opacity: 1 }}
												animate={{ x: 0, opacity: 1 }}
												exit={{ x: "-50%", opacity: 0 }}
												transition={{ duration: 0.3 }}
												className="fourth-screen"
											>
												<Form.Item
													className="custom-label"
													label="City"
													name="city"
													rules={[
														{
															required: true,
															message: "Please enter your city",
														},
													]}
												>
													<Input placeholder="Type Your city Here" />
												</Form.Item>

												<Form.Item
													className="custom-label"
													label="Street Address"
													name="address"
													rules={[
														{
															required: true,
															message: "Please enter your address",
														},
													]}
												>
													<Input placeholder="Type your address Here" />
												</Form.Item>
											</motion.div>
										)}
										{currentScreen === 5 && (
											<motion.div
												key="fifth-screen"
												initial={{ x: 0, opacity: 1 }}
												animate={{ x: 0, opacity: 1 }}
												exit={{ x: "-50%", opacity: 0 }}
												transition={{ duration: 0.3 }}
												className="fifth-screen"
											>
												<Form.Item
													className="custom-label"
													label="What is your province? "
													name="province"
													rules={[
														{
															required: true,
															message: "Please select your province",
														},
													]}
												>
													<Select
														placeholder="Select your province"
														style={selectInputStyle}
														suffixIcon={<img src={arrowDown} alt="Drop Down" />}
													>
														<Option value="ON">Ontario</Option>
														<Option value="QC">Quebec</Option>
														<Option value="BC">British Columbia</Option>
														<Option value="AB">Alberta</Option>
														<Option value="MB">Manitoba</Option>
														<Option value="SK">Saskatchewan</Option>
														<Option value="NS">Nova Scotia</Option>
														<Option value="NB">New Brunswick</Option>
														<Option value="NL">
															Newfoundland and Labrador
														</Option>
														<Option value="PE">Prince Edward Island</Option>
														<Option value="NT">Northwest Territories</Option>
														<Option value="YT">Yukon</Option>
														<Option value="NU">Nunavut</Option>
													</Select>
												</Form.Item>

												<Form.Item
													className="custom-label"
													label="What is your postal code?"
													name="postalCode"
													rules={[
														{
															required: true,
															message: "Please enter your postal code",
														},
													]}
												>
													<Input placeholder="Type your Postal Code" />
												</Form.Item>
												<Form.Item
													wrapperCol={{
														span: 24,
													}}
													name="terms"
													valuePropName="checked"
													rules={[
														{
															required: true,
															message:
																"You must agree to the terms and conditions",
														},
													]}
												>
													<Checkbox>
														By getting a start, you agree to our{" "}
														<Link
															className="link"
															to="/terms"
															onClick={saveFormData}
														>
															Terms & Conditions
														</Link>{" "}
														and{" "}
														<Link
															className="link"
															to="/privacy"
															onClick={saveFormData}
														>
															Privacy Policy
														</Link>
														.
													</Checkbox>
												</Form.Item>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
								{currentScreen === 5 ? (
									<div style={{ marginTop: "auto" }}>
										<Form.Item wrapperCol={{ span: 24 }}>
											<Button
												disabled={!isScreenValid}
												className="get-quote-btn"
												type="primary"
												htmlType="submit"
												block
												loading={isSubmitting}
											>
												<img src={telegramIcon} alt="Icon" /> Get Quote
											</Button>
										</Form.Item>
									</div>
								) : (
									<div className="btn_container">
										<button
											type="button"
											className="arrow-left-btn"
											onClick={handleNextScreen}
											disabled={!isScreenValid} // Disable if current screen is not valid
										>
											<IoIosArrowForward size={28} color="#fff" />
										</button>
									</div>
								)}
							</Form>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default FormPage;
