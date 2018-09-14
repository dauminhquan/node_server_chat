const autoIncrement = require('mongoose-auto-increment');
const Company = require('./Company')
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;
var randToken = require('rand-token');
var UserSchema = new Schema({
    id: {
        type: Number,
        index: {
            unique: true,
        },
        required: true,
        min: 1,
        autoIncrement: true
    },
    username:  {
        type: String,
        required: true,
        alias: 'n'
    },
    avatar: {
        type: String,
        default: 'https://scontent.fhan2-1.fna.fbcdn.net/v/t1.0-9/39933181_976704199167164_8345605060855595008_n.jpg?_nc_cat=0&oh=5c4e286a07c7e016f868f593e4839bce&oe=5C3348EA'
    },
    password: {
        type: String,
        required: true
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
    type: {
        type: Number,
        minimum: 0,
    },
    token: {
        type: String,
        default: function() {
            return randToken.generate(64);
        },
        index: {
            unique: true
        }
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    groups: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Group',
            unique: true,
            message_readed: {
                type: Schema.Types.ObjectId,
                ref: 'Message'
            }
        }
    ],
    users_block: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    invites_group: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Group'
        }
    ],
    requests_group: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Group'
        }
    ],
    projects:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Project'
        }
    ]
});

UserSchema.path('email').validate(function (email) {
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email); // Assuming email has a text attribute
}, 'The e-mail field cannot be empty.')

UserSchema.pre('save', function(next) {
    var user = this;

    Company.findById(user.company,function (err,doc) {
        if(doc == null)
        {
            err = new Error('Company not found')
            err.code = 404
            return err
        }
        else{
            // only hash the password if it has been modified (or is new)
            if (!user.isModified('password')) return next();

            // generate a salt
            bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
                if (err) return next(err);

                // hash the password using our new salt
                bcrypt.hash(user.password, salt, function(err, hash) {
                    if (err) return next(err);

                    // override the cleartext password with the hashed one
                    user.password = hash;
                    next();
                });
            });
        }
    })

});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.methods.getToken = function(){

}

const User = mongoose.model('User', UserSchema);
autoIncrement.initialize(mongoose.connection);
UserSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'id' });
module.exports = User
