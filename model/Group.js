var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
var GroupSchema = new Schema({
    id: {
        type: Number,
        index: {
            unique: true,
        },
        required: true,
        min: 1,
        autoIncrement: true
    },
    name:  {
        type: String,
        required: true,
        alias: 'n',
    },
    status: {
        type : String,
        enum: ['open','block'],
        default: 'open'
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    created_at: {
        type: Date,
        default: Date.now
    },
    invites_user: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    requests_user: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});
const Group = mongoose.model('Group', GroupSchema);
autoIncrement.initialize(mongoose.connection);
GroupSchema.plugin(autoIncrement.plugin, { model: 'Group', field: 'id' })
module.exports = Group

