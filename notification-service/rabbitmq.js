const amqp = require("amqplib");

const connect = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue("booking_notifications");

    console.log("Waiting for messages...");
    channel.consume("booking_notifications", (msg) => {
        console.log("Received notification:", msg.content.toString());
        channel.ack(msg);
    });
};

connect();
