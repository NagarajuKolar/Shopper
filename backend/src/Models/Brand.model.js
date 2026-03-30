import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        isActiveBrand: {
            type: Boolean,
            default: true
        },


        logo: {
            type: String,
        },

        description: {
            type: String,
        },

        country: {
            type: String,
        },

        website: {
            type: String,
        },

        productCount: {
            type: Number,
            default: 0,
        },

        totalSales: {
            type: Number,
            default: 0,
        },

        popularityScore: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Brand = mongoose.model("Brand", BrandSchema);//ref:Brand if  model brand then ref:brand

export default Brand;
