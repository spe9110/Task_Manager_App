import { expressjwt } from "express-jwt";

export const requiredAuth = expressjwt({
    secret: () => process.env.JWT_SECRET,
    algorithms: ['HS256'],
    requestProperty: 'user',
    getToken: (req) => {
        if(req.headers.authorization && req.headers.authorization.split(' ')[1] === 'Bearer'){
            return req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.AccessToken){
            return req.cookies?.AccessToken;
        }
        return null;
            
    }
})