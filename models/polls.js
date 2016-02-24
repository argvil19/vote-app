var mongoose = require('mongoose');

var poolSchema = mongoose.Schema({
    name: String,
    author: String,
    options: {
        type:Array, default:[]
    },
    ipVoted:{
        type:Array, default:[]
    }
});

module.exports = mongoose.model('Polls', poolSchema, 'polls');