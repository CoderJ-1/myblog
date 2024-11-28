import jwt from 'jsonwebtoken'

export const VerifyToken = (req, res, next) =>{
    const token = req.cookies.access_token;
    if(!token) {
        return next(errorHandler(401, 'UnAuthorized'))
    }
    jwt.verify(token, process.env.JWTPRIVATEKEY, (err, user)  =>{
        if(err) {
            return next(errorHandler(401, 'UnAuthorized'))
        }
        req.user = user 
        next();
    });
};