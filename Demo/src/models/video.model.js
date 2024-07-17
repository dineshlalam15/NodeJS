import {Schema, model} from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const videoSchema = new Schema({
    id:{
        type: String,
        required: true,
        unique: true
    },
    videoFile: {
        type: String, 
        required: true,
    },
    thumbnail: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        required: true
    }
}, {timestamps: true})

videoSchema.plugin(mongooseAggregatePaginate)

const Video = model('Video', videoSchema)
export default Video