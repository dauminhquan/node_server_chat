var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
var ProjectSchema = new Schema({
    id: {
        type: Number,
        index: {
            unique: true
        },
        required: true,
        min: 1,
        autoIncrement: true
    },
    name: {
        type:String,
        required: true,
        index: true
    },
    detail:  {
        type: String,
        required: true,
        alias: 'd',
    },
    status: {
        type: String,
        enum: ['coming_soon','opening','resolved','cancel','closed'],
        default: 'coming_soon'

    },
    started_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    ended_at: {
        type: Date
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            unique: true
        }
    ],
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        index: true,
        required: true
    },
});
const Project = mongoose.model('Project', ProjectSchema);
autoIncrement.initialize(mongoose.connection);
ProjectSchema.plugin(autoIncrement.plugin, { model: 'Project', field: 'id' })
module.exports = Project

