import dbConnect from "@/lib/dbConnect";
import bcryptjs from "bcryptjs";
import UserModel from "@/model/User";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
	await dbConnect();

	try {
		const { username, email, password } = await request.json();

		const existingUserVerifiedByUsername = await UserModel.findOne({
			email,
			isVerified: true,
		});

		if (existingUserVerifiedByUsername) {
			return Response.json(
				{
					success: false,
					message: "Username is already taken",
				},
				{ status: 400 }
			);
		}

		const existingUserByEmail = await UserModel.findOne({ email });

		// Random 6 digit code generation for verification code
		const verifyCode = Math.floor(
			100000 + Math.random() * 900000
		).toString();

		if (existingUserByEmail) {
			// Todo: user email registerd hai but email verified nhi hai
			if (existingUserByEmail.isVerified) {
				return Response.json(
					{
						success: false,
						message: "User Already exist with this email",
					},
					{ status: 400 }
				);
			} else {
				// existing email hai but email verified hai ya nhi hai
				const hashedPassword = await bcryptjs.hash(password, 10);

				existingUserByEmail.password = hashedPassword;
				existingUserByEmail.verifyCode = verifyCode;
				existingUserByEmail.verifyCodeExpiry = new Date(
					Date.now() + 3600000
				);

				await existingUserByEmail.save();
			}
		} else {
			// New email(user) Register process
			const hashedPassword = await bcryptjs.hash(password, 10);

			// Expiry time will be 1 hr
			const expiryDate = new Date();
			expiryDate.setHours(expiryDate.getHours() + 1);

			// New user added in db
			const newUser = new UserModel({
				username,
				email,
				password: hashedPassword,
				verifyCode,
				verifyCodeExpiry: expiryDate,
				isVerified: false,
				isAcceptingMessage: true,
				messages: [],
			});

			await newUser.save();
		}

		// Send Verification email
		const emailResponse = await sendVerificationEmail(
			email,
			username,
			verifyCode
		);

		// If email verification link is not sended
		if (!emailResponse.success) {
			return Response.json(
				{
					success: false,
					message: emailResponse.message,
				},
				{ status: 500 }
			);
		}
		return Response.json(
			{
				success: true,
				message: "User registerd successfully",
			},
			{ status: 201 }
		);
	} catch (error) {
		console.log("Error registering user error", error);
		return Response.json(
			{
				success: false,
				message: "Error registering user",
			},
			{
				status: 500,
			}
		);
	}
}
