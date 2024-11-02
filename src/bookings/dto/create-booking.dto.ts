export class CreateBookingDto {
    id: string;
    userId:string;
    propertyId: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
}
