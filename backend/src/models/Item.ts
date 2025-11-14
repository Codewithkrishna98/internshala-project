import { Schema, model, Document, Types } from "mongoose";

export interface IItem extends Document {
  title: string;
  description?: string;
  owner: Types.ObjectId; // user id
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<IItem>({
  title: { type: String, required: true },
  description: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export default model<IItem>("Item", ItemSchema);
