import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    dateOrder: {
        type: Date,
        required: true,
        default: Date.now,
    },
    numberOrder: {
        type: Number,
        required: true,
        unique: true,
    },
    consumptionAccount: {
        type: Number,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    paymentState: {
        type: String,
        required: true,
        enum: ['paid', 'pending'],
        default: 'pending',
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
