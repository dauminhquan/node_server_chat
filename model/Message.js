const autoIncrement = require('mongoose-auto-increment');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema
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
      type:String
    },
    type:{
        type: String,
        match: ['image','file','string'],
        default: 'string'
    },
    user:  {
        type: Schema.Types.ObjectId,
        ref: 'Message',
        required: true
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    }
});


const Message = mongoose.model('Message', MessageSchema);
autoIncrement.initialize(mongoose.connection);
MessageSchema.plugin(autoIncrement.plugin, { model: 'Message', field: 'id' });
module.exports = Message