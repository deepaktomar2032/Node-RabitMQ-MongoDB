import { Request, Response } from 'express'
import { Product } from '@src/entity/Product'
import { LogErrorMessage } from '@src/utils'
import { dataBase, rabbitmqChannel } from '@src/server/server'

export const createProduct = async (req: Request, res: Response) => {
  try {
    const result = await getProductRepository().save(req.body)
    rabbitmqChannel.sendToQueue('product_created', Buffer.from(JSON.stringify(result)))
    return res.send(result)
  } catch (error: unknown) {
    console.log(LogErrorMessage(error))
    throw error
  }
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await getProductRepository().find()
    res.json(products)
  } catch (error: unknown) {
    console.log(LogErrorMessage(error))
    throw error
  }
}

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const product = await getProductRepository().findOneBy({ id })
    return res.send(product)
  } catch (error: unknown) {
    console.log(LogErrorMessage(error))
    throw error
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const product = await getProductRepository().findOneBy({ id })
    getProductRepository().merge(product, req.body)
    const result = await getProductRepository().save(product)
    rabbitmqChannel.sendToQueue('product_updated', Buffer.from(JSON.stringify(result)))
    return res.send(result)
  } catch (error: unknown) {
    console.log(LogErrorMessage(error))
    throw error
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await getProductRepository().delete(id)
    rabbitmqChannel.sendToQueue('product_deleted', Buffer.from(req.params.id))
    return res.send(result)
    // })
  } catch (error: unknown) {
    console.log(LogErrorMessage(error))
    throw error
  }
}

export const increaseLikes = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const product = await getProductRepository().findOneBy({ id })
    product.likes++
    const result = await getProductRepository().save(product)
    return res.send(result)
  } catch (error: unknown) {
    console.log(LogErrorMessage(error))
    throw error
  }
}

const getProductRepository = () => {
  return dataBase.getRepository(Product)
}
