import { Injectable } from "@nestjs/common/decorators";
import { InjectModel } from "@nestjs/mongoose";
import { User,UserSchema } from "../models/user.model";
import { Model } from "mongoose";
import * as bcrypt from 'bcrypt';
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
@Injectable()
export class UserService{
    constructor(@InjectModel(User.name)private userModel:Model<User>){

    }
    async getUser(user:User):Promise<User>{
        const u = await this.userModel.findOne({ username: user.username}).exec();
        if (!u) {
            throw new NotFoundException('Usuario no encontrado');
          }
      
          const isPasswordValid = await bcrypt.compare(user.password, u.password);
      
          if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
          }
      
          // Elimina la propiedad de contraseña del objeto de respuesta
          u.password=null;
      
          return u;
        
    }
     // Método para crear un nuevo usuario y guardarlo en la base de datos
     async createUser(user: User): Promise<User> {
      // Hashear la contraseña antes de guardar el usuario
      const saltRounds = 10;  // Número de saltos (rounds) para bcrypt
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      
      // Crear un nuevo usuario utilizando el modelo de Mongoose
      const newUser = new this.userModel({
          username: user.username,
          password: hashedPassword,  // Guardar la contraseña hasheada
      });

      // Guardar el usuario en la base de datos
      return newUser.save();
  }
}