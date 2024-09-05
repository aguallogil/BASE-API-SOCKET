import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
@Schema()
export class User {
    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    _id: string;
}
export const UserSchema = (mongoose.models.User || SchemaFactory.createForClass(User)) as Model<User>;