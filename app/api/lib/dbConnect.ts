import { connect, ConnectionStates } from 'mongoose';

const connection: { isConnected?: ConnectionStates } = {};

async function dbConnect() {
    if (connection.isConnected == ConnectionStates.connected) {
        return;
    }

    const db = await connect(process.env.MONGODB_URI!);

    connection.isConnected = await db.connections[0].readyState;
}

export default dbConnect;