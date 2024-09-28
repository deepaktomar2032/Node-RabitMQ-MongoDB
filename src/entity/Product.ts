import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity()
export class Product {
  @ObjectIdColumn()
  _id: ObjectId

  @Column({ type: 'number' })
  admin_id: number

  @Column({ type: 'string' })
  title: string

  @Column({ type: 'string' })
  image: string

  @Column({ type: 'number' })
  likes: number
}
