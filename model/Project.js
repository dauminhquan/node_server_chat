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
    detail:  {
        type: String,
        required: true,
        alias: 'd',
    },
    status: {
        type: String,
        match: ['coming_soon','opening','resolved','cancel','closed'],

    },
    started_at: {
        type: Date,
        required: true,
        default: new Date()
    },
    ended_at: {
        type: Date
    },
    member: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            unique: true
        }
    ],
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        unique: true
    },
});

const Project = mongoose.model('Project', ProjectSchema);
autoIncrement.initialize(mongoose.connection);
ProjectSchema.plugin(autoIncrement.plugin, { model: 'Project', field: 'id' })
module.exports = Project

