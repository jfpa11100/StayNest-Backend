import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Review } from "./review.entity";
import { Photo } from "./photo.entity";

@Entity('properties')
export class Property{
    @PrimaryGeneratedColumn('uuid')
    id:string;
    
    @ManyToOne(() => User, user => user.properties)
    user: User

    @Column({ type:'varchar' })
    title: string
    
    @Column({ type: 'text' })
    description: string

    @Column({ type: 'text' })
    address: string

    @Column({ name:'price_per_night', type: 'int' })
    pricePerNight: number

    @Column({ type:'int' })
    bedrooms: number

    @Column({ type:'int' })
    bathrooms: number

    @Column({ type:'int' })
    capacity: number

    @CreateDateColumn({ name:'created_at'})
    createdAt: Date

    @UpdateDateColumn({ name:'updated_at'})
    updatedAt: Date

    @OneToMany(() => Review, review => review.property)
    reviews: Review[]

    @OneToMany(() => Photo, photo => photo.property, { cascade: true })
    photos: Photo[]
}
