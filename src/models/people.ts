import mongoose, { Document, Schema } from "mongoose";

export enum PersonType {
  MAN = "man",
  WOMAN = "woman",
  BOY = "boy",
  GIRL = "girl",
}
export interface IPeople extends Document {
  type: "man" | "woman" | "boy" | "girl";
  count: number;
}

const PeopleSchema: Schema = new Schema({
  type: { type: String, required: true, enum: Object.values(PersonType) },
  count: { type: Number, required: true, min: 0 },
});

export default mongoose.model<IPeople>("People", PeopleSchema);
