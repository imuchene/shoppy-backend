import { Injectable } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';

@Injectable()
export class UsersService {

  async createUser(data: CreateUserRequest){
    
  }
}
