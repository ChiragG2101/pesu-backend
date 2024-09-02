import mongoose, { Document, Schema } from 'mongoose';

export interface IPeople extends Document {
  type: 'man' | 'woman' | 'boy' | 'girl';
  count: number;
}

const PeopleSchema: Schema = new Schema({
  type: { type: String, required: true, enum: ['man', 'woman', 'boy', 'girl'] },
  count: { type: Number, required: true, min: 0 }
});

export default mongoose.model<IPeople>('People', PeopleSchema);