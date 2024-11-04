export class CreateUserDto {
    name: string;
    username: string;
    email: string;
    password: string;
    isOwner:boolean = false;
}
