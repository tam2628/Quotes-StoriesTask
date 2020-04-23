function isAuthenticated(req, res, next){
    if(req.cookies.jwt)
        return res.redirect('/dashboard');
    
        next();
}

function isNotAuthenticated(req, res, next){
    if(!req.cookies.jwt)
        return res.redirect('/');
    
        next();
}

module.exports = {isAuthenticated, isNotAuthenticated};