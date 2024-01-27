
import {Role} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'




export class CreateUserDto {
  email: string;
password: string;
fullname?: string;
username: string;
@ApiProperty({ enum: Role})
role: Role;
}
