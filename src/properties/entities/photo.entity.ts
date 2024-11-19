import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Property } from "./property.entity";

@Entity('photos')
export class Photo{
    
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => Property, property => property.photos,{ onDelete: "CASCADE", onUpdate: "CASCADE" })
    property: Property

    @Column({ type:'varchar' })
    url:string

    @CreateDateColumn({ name:'created_at'})
    createdAt: Date
}