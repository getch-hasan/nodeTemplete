import mongoose, { Document, Schema } from "mongoose";

interface IProduct extends Document {
  name: string;
  price: number;  // Changed from string to number
  description: string;
  category: mongoose.Types.ObjectId;
  thumb: string;
  gallary: string[];
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true }, // Changed from string to number
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    thumb: { type: String, required: true },
    gallary: { type: [String], default: [] }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
