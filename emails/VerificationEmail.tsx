// Email Template (Component)
import * as React from "react";
import { Html } from "@react-email/html";

interface EmailTemplateProps {
	username: string;
	otp: string;
}

const VerificationEmail = ({ username, otp }: EmailTemplateProps) => (
	<Html lang="en">
		<div>
			<h1>Welcome, {username}!</h1>
			<p>Your OTP is {otp}</p>
		</div>
	</Html>
);

export default VerificationEmail;
