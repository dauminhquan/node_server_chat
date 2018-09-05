var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
var CompanySchema = new Schema({
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
        index: {
            unique: true
        }
    },
    address:   {
        type: String,
        required: true,
        alias: 'a'
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    website: {
        type: String,
        required: true,
        index: {
            unique: true
        },
        alias: 'w'
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Users',
            unique: true
        }
    ],
    projects: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Projects',
            unique: true
        }
    ],
    groups: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Groups',
            unique: true
        }
    ]
});

CompanySchema.path('email').validate(function (email) {
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email); // Assuming email has a text attribute
}, 'The e-mail field cannot be empty.')


const Company = mongoose.model('Company', CompanySchema);
autoIncrement.initialize(mongoose.connection);
CompanySchema.plugin(autoIncrement.plugin, { model: 'Company', field: 'id' })
module.exports = Company

