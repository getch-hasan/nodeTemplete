import mongoose, { Document, Schema } from "mongoose";

interface IProduct extends Document{
    name:string;
    price:string;
    description:string;
    category:string;
    thumb:string;
    gallary:[string],default: [];
}
const ProductSchema=new Schema<IProduct>(
    {
        name:{type:String,required:true},
        price:{type:String,required:true},
        description:{type:String,required:true},
        category:{type:String,required:true},
        thumb:{type:String,required:true},
        gallary:{type:[String],default: []}
    },{
        timestamps:true
    }
)
export default mongoose.model<IProduct>('Product',ProductSchema)