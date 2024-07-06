import { Document, Schema, model, models } from "mongoose";

export interface IViews extends Document {
    slug: string;
    uniqueVisitorId: string;
}

const viewsSchema = new Schema({
    slug: { type: String, required: true },
    uniqueVisitorId: { type: String, unique: true, required: true },
}, { timestamps: true });


const Views = models.Views || model<IViews>('Views', viewsSchema);

export default Views;
