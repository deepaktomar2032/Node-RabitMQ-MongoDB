import { Product } from '@src/entity/Product'
import { dataBase, rabbitmqChannel } from '@src/server/server'

export const consumerService = async () => {
  rabbitmqChannel.consume(
    'product_created',
    async (msg: any) => {
      const eventProduct = JSON.parse(msg.content.toString())
      console.log('eventProduct', eventProduct)

      const product = new Product()
      product.admin_id = parseInt(eventProduct.id)
      product.title = eventProduct.title
      product.image = eventProduct.image
      product.likes = eventProduct.likes
      await getProductRepository().save(product)
      console.log('product created')
    },
    { noAck: true },
  )

  rabbitmqChannel.consume(
    'product_updated',
    async (msg: any) => {
      const eventProduct = JSON.parse(msg.content.toString())
      const product = await getProductRepository().findOne({ admin_id: parseInt(eventProduct.id) })
      getProductRepository().merge(product, {
        title: eventProduct.title,
        image: eventProduct.image,
        likes: eventProduct.likes,
      })
      await getProductRepository().save(product)
      console.log('product updated')
    },
    { noAck: true },
  )

  rabbitmqChannel.consume('product_deleted', async (msg: any) => {
    const admin_id = parseInt(msg.content.toString())
    await getProductRepository().deleteOne({ admin_id })
    console.log('product deleted')
  })
}

const getProductRepository = () => {
  return dataBase.getRepository(Product)
}
