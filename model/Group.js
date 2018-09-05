var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
var GroupSchema = new Schema({
    id: {
        type: Number,
        index: {
            unique: true
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
        match: ['open','block'],
        default: 'open'
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            unique: true
        }
    ],
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        unique: true
    },
    created_at: {
        type: Date,
        default: new Date()
    },
    invites_user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    requests_user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

GroupSchema.path('email').validate(function (email) {
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email); // Assuming email has a text attribute
}, 'The e-mail field cannot be empty.')


const Group = mongoose.model('Group', GroupSchema);
autoIncrement.initialize(mongoose.connection);
GroupSchema.plugin(autoIncrement.plugin, { model: 'Group', field: 'id' })
module.exports = Group

