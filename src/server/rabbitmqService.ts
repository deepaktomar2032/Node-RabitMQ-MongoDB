import amqp from 'amqplib'

export const initializeRabbitMQ = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL!)

  connection.once('close', () => {
    console.warn('RabbitMQ connection closed, exiting…')
    process.kill(process.pid, 'SIGTERM')
  })

  connection.on('error', (err) => {
    console.error('onRabbitmqConnection error', err)
  })

  const rabbitmqChannel = await connection.createChannel()

  rabbitmqChannel.assertQueue('product_created', { durable: false })
  rabbitmqChannel.assertQueue('product_updated', { durable: false })
  rabbitmqChannel.assertQueue('product_deleted', { durable: false })

  return rabbitmqChannel
}
