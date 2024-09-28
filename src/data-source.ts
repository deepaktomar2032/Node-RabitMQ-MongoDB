import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Product } from './entity/Product'

export const AppDataSource = new DataSource({
  type: 'mongodb',
  url: process.env.DATABASE_URL!,
  synchronize: true,
  logging: false,
  entities: [Product],
})
