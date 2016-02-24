var polls = require('../models/polls');
var user = require('../models/user');

module.exports = function(app, passport) {
    
    /* INDEX */
    
    app.get('/', function(req, res) {
        var sendParams = {
            message:req.flash('message')[0]
        };
        polls.find({}, {__v:0}, function(err, polls) {
            if (err)
                return res.render('error', {
                    error:err,
                    message:err.message
                });
            if (polls.length) {
                sendParams.polls = polls;
            }
            if (req.isAuthenticated())
                sendParams.user = req.user;
            return res.render('index', sendParams);
        });
    });
    
    /* LOGIN */
    
    app.get('/login', function(req, res) {
        if (req.isAuthenticated()) {
            return res.redirect('/');
        }
        return res.render('login', {message:req.flash('loginMessage')});
    });
    
    app.post('/login', passport.authenticate('local-login', {
        successRedirect:'/',
        failureRedirect:'/login',
        failureFlash:true
    }));
    
    /* SIGN UP */
    
    app.get('/signup', function(req, res) {
        if (req.isAuthenticated()) {
            return res.redirect('/');
        }
        return res.render('signup', {message:req.flash('signupMessage')});
    });
    
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect:'/',
        failureRedirect:'/signup',
        failureFlash:true
    }));
    
    /* CREATE POLLS */
    
    app.get('/poll/new', isLoggedIn, function(req, res) {
        res.render('createPoll');
    });
    
    app.post('/pool/new', isLoggedIn, function(req, res) {
        polls.findOne({name:req.body.pollName}, function(err, data) {
            if (err)
                return res.render('error', {
                    error:err,
                    message:err.message
                });
            if (data) {
                return res.render('createPoll', {message:'That poll already exist'});
            } else {
                var newPoll = new polls();
                var options = [];
                var opts = JSON.parse(req.body['hideOptions']);
                req.flash('message', 'Poll successfully created.');
                
                
                newPoll.name = req.body.pollName;
                newPoll.author = req.user.email;
                
                for (var i=0;i<opts.length;i++) {
                    options.push({
                        optName:opts[i],
                        votes:0
                        });
                    if (i === (opts.length - 1)) {
                        newPoll.options = options;
                        newPoll.save(function(err) {
                            if (err)
                                throw err;
                            return res.redirect('/');
                        });
                    }
                }
            }
        });
    });
    
    /* UPDATE POLL */
    
    app.post('/poll/update', isLoggedIn, function(req, res) {
        var newOpt = req.body.optName;
        var id = req.body._id;
        
        polls.findOne({_id:id}, function(err, data) {
            if (err) {
                throw err;
            }
            for (var i=0;i<data.options.length;i++) {
                if (newOpt === data.options[i].optName) {
                    req.flash('message', 'Duplicated option');
                    return res.redirect('/poll/'+id);
                } else {
                    if (i+1===data.options.length) {
                        polls.update({_id:id}, {
                            $push:{
                                options:{
                                    optName:newOpt,
                                    votes:0
                                }
                            }
                        }, function(err, data) {
                            if (err) {
                                throw err;
                            }
                            req.flash('message', "Your option has been successfully added");
                            return res.redirect('/poll/'+id);
                        });
                    }
                }
            }
        });
    });
    
    /* DELETE POLL */
    
    app.get('/poll/delete', isLoggedIn, function(req, res) {
        polls.find({author:req.user.email}, {name:1}, function(err, data) {
            if (err) {
                return res.render('error', {
                    error:err,
                    message:err.message
                });
            }
            if (data) {
                return res.render('removePolls', {
                    polls:data
                });
            } else {
                return res.render('removePolls', {
                    message:'ERROR: You have not created any poll.'
                });
            }
        });
    });
    
    app.post('/poll/delete', isLoggedIn, function(req, res) {
        var pollName = req.body.polls;
        polls.findOne({name:pollName, author:req.user.email}).remove(function(err, removed) {
            if (err) {
                return res.render('error', {
                    error:err,
                    message:err.message
                });
            }
            if (removed) {
                req.flash('message', 'Poll deleted');
                return res.redirect('/');
            } else {
                return res.send('ERROR');
            }
        });
    });
    
    /* DISPLAY POLLS */
    
    app.get('/poll/:id', function(req, res) {
        polls.findOne({_id:req.params.id}, {__v:0}, function(err, data) {
            if (err) {
                return res.render('error', {
                    error:err,
                    message:err.message
                });
            }
            if (data) {
                return res.render('displayPoll', {
                    poll:{
                        name:data.name,
                        author:data.author,
                        options:data.options,
                        _id:data._id,
                    },
                    user:req.user,
                    message:req.flash('message')[0]
                });
            }
        });
    });
    
    /* VOTE POLL */
    
    app.post('/vote', function(req, res) {
        var voteValue = req.body.voteOption;
        var ipVoted = req.headers['x-forwarded-for'];
        var id = req.body._id;
        polls.findOne({_id:id}, function(err, data) {
            if (err) {
                return res.render('error', {
                        error:err,
                        message:err
                    });
            }
            if (data.ipVoted.length) {
                for (var i=0; i<data.ipVoted.length;i++) {
                    if (data.ipVoted[i] === ipVoted) {
                        req.flash('message', "You can't vote more than once in a single poll");
                        return res.redirect('/poll/'+id);
                    } else {
                        if (i === data.ipVoted.length) {
                            return updateVote(data, voteValue, ipVoted, id, req, res);
                        }
                    }
                }
            } else {
                return updateVote(data, voteValue, ipVoted, id, req, res);
            }
        });
    });
    
    /* PROFILE */
    
    app.use('/profile', isLoggedIn, function(req, res) {
        var sendParams = {
            user:req.user
        };
        polls.find({author:req.user.email}, function(err, data) {
            if (err) {
                return res.render('error', {
                    error:err,
                    message:err.message
                });
            }
            if (data.length) {
                sendParams.polls = data;
                sendParams.total;
                
                getTotalVotes(req.user.email, function(total) {
                    sendParams.total = total;
                    return res.render('profile', sendParams);
                });
                
                
            } else {
                sendParams.polls = [];
                sendParams.total = 0;
                
                return res.render('profile', sendParams);
            }
        });
    });
    
    /* LOGOUT */
    
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
       return next();
    }
    res.redirect('/');
}

function getTotalVotes(author, cb) {
    polls.aggregate({
        $match: {
            author:author
        }
    }, {
        $unwind:'$options'
    }, {
        $group:{
            _id:'$_id',
            total:{
                $sum: '$options.votes'
            }
        }
    }, function(err, data) {
        if (err)
            throw err;
        return cb(data[0].total);
    });
}

function updateVote(data, voteValue, ipVoted, id, req, res) {
    for (var i=0;i<data.options.length;i++) {
        if (voteValue === data.options[i].optName) {
            polls.update({'options.optName':data.options[i].optName}, {$set:{
                'options.$.votes':data.options[i].votes+1,
                },
                    $push:{
                        'ipVoted':ipVoted
                    }
                }, function(err, dd) {
                if (err) {
                    throw err;
                }
                req.flash('message', "Your vote has been successfully saved");
                return res.redirect('/poll/' + id);
            });
        }
    }
}

