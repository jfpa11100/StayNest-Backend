import { Property } from "src/properties/entities/property.entity";
import { Review } from "src/properties/entities/review.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ unique: true, })
    username: string;

    @Column({ type:'varchar', unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ name:'profile_picture', type:'text', default: '' })
    profilePicture: string;

    @Column({type:'text', nullable:true })
    bio: string

    @Column({ 
        name:'is_owner',
        type: 'bool',
        default: false
     })
    isOwner: boolean;

    @CreateDateColumn({ name:'created_at' })
    createdAt: Date 
    
    @UpdateDateColumn({ name:'updated_at' })
    updatedAt: Date 
    
    @Column('text')
    name: string;

    @OneToMany(() => Property, property => property.user)
    properties: Property[]

    @OneToMany(() => Review, review => review.user)
    reviews: Review[]
}
