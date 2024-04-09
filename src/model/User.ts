import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document {
	content: string;
	createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
	content: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

export interface User extends Document {
	username: string;
	email: string;
	password: string;
	verifyCode: string;
	verifyCodeExpiry: Date;
	isVerified: boolean;
	isAcceptingMessage: boolean;
	messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
	username: {
		type: String,
		required: [true, "Please provide a username"],
		trim: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		match: [/^.+@.+\..+$/, "Please provide a valid email address"],
	},
	password: {
		type: String,
		required: true,
	},
	verifyCode: {
		type: String,
		required: true,
	},
	verifyCodeExpiry: {
		type: Date,
		required: true,
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	isAcceptingMessage: {
		type: Boolean,
		default: true,
	},
	messages: [MessageSchema],
});

// Already a model is present in db if not then create one
const UserModel =
	(mongoose.models.User as mongoose.Model<User>) ||
	mongoose.model<User>("User", UserSchema);

export default UserModel;
