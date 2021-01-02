module.exports = {
    ensureAuthenticated:function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }else {
            req.flash("error_msg","you can not authorized user please login");
            res.redirect("/auth/login");
        }
    }
};