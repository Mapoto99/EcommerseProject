import mongoose, {Schema, Document} from "mongoose";

export interface IUser extends Document{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

const userSchema = new Schema<IUser>({
    firstName: {type: String, reqeuired: true},
    lastName: {type: String, reqeuired: true},
    email: {type: String, reqeuired: true},
    password: {type: String, reqeuired: true}
})

const userModel = mongoose.model<IUser>('User', userSchema);
export default userModel;
