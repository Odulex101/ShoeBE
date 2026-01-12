
// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
// 	{
// 		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
// 		product: {
// 			name: String,
// 			price: Number,
// 			image: String,
// 		},
// 	},
// 	{ timestamps: true }
// );

// export default mongoose.model("Order", orderSchema);


import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		items: [
			{
				productId: Number,
				name: String,
				image: String,
				price: Number,
				quantity: Number,
			},
		],

		delivery: {
			fullName: String,
			address: String,
			phone: String,
		},

		deliveryDateRange: {
			start: {
				type: Date,
				required: true,
			},
			end: {
				type: Date,
				required: true,
			},
		},

		paymentMethod: {
			type: String,
			default: "Pay on Delivery (Bank Transfer)",
		},

		totalAmount: Number,

		status: {
			type: String,
			default: "Pending",
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Order", orderSchema);




