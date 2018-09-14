const autoIncrement = require('mongoose-auto-increment');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema
const mongoosePaginate = require('mongoose-paginate')
var MessageSchema = new Schema({
    id: {
        type: Number,
        index: {
            unique: true,
        },
        required: true,
        min: 1,
        autoIncrement: true
    },
    content: {
        type:String,
        required: true
    },
    contentText: {
      type:String,
        required: true
    },
    type:{
        type: String,
        enum: ['image','file','string'],
        default: 'string'
    },
    user:  {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    location: {
        type: String
    }
});

MessageSchema.plugin(mongoosePaginate)
const Message = mongoose.model('Message', MessageSchema);
autoIncrement.initialize(mongoose.connection);
MessageSchema.plugin(autoIncrement.plugin, { model: 'Message', field: 'id' });
module.exports = Message
