import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Property } from "./property.entity";
import { User } from "src/users/entities/user.entity";

@Entity('reviews')
export class Review{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => Property, property => property.reviews,
        { onDelete: "CASCADE" }
    )
    property: Property

    @ManyToOne(() => User, user => user.reviews)
    user:User

    @Column({ type:'int' })
    rating:number

    @Column({ type: 'varchar' })
    comment: string;

    @CreateDateColumn({ name:'created_at' })
    createdAt: Date
}