import { Property } from "src/properties/entities/property.entity"
import { User } from "src/users/entities/user.entity"
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity('bookings')
export class Booking {

    @PrimaryGeneratedColumn('uuid')
    id:string

    @ManyToOne(() => Property, property => property.reviews,
        { onDelete: "CASCADE" }
    )
    property: Property

    @ManyToOne(() => User, user => user.reviews)
    user:User

    @Column({ name:'start_date', type:'date'  })
    startDate: Date
    
    @Column({ name:'end_date', type:'date'  })
    endDate:Date
    
    @Column({ name:'total_price', type:'int'  })
    totalPrice: number

    @CreateDateColumn({ name:'created_at' })
    createdAt: Date

}
