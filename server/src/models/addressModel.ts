import mongoose, { Schema, model } from 'mongoose';

export interface AddressType {
    addressLine1: string;
    landmark: string | 'N/A';
    city: string;
    state: string;
    userId: mongoose.Types.ObjectId;
    type: string | 'Home';
}

const addressSchema = new Schema<AddressType>({
    addressLine1: {
        type: String,
        required: true
    },
    landmark: {
        type: String,
        default: 'N/A'
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        default: 'Home',
        required: true
    }
})

const Address = model('Address', addressSchema);
export default Address