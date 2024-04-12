import mongoose from "mongoose";

// Db connection type, Mostly it will return number
type ConnectionObject = {
	isConnected?: number;
};

const connection: ConnectionObject = {};

// void: We don't care about the return value
async function dbConnect(): Promise<void> {
	// If the connection is already established, return
	if (connection.isConnected) {
		console.log("Already connected to the database");
		return;
	}

	try {
		// Connect to the database
		const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

		// Return the connection object may be a number (0 or 1)
		connection.isConnected = db.connections[0].readyState;

		console.log("Db connection established");
	} catch (error) {
		console.log("Db connection failed", error);
		process.exit();
	}
}

export default dbConnect;
