import { expressjwt } from "express-jwt";

export const requiredAuth = expressjwt({
    secret: () => process.env.JWT_SECRET,
    algorithms: ['HS256'],
    requestProperty: 'auth',
    getToken: (req) => {
        if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
            return req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.AccessToken){
            return req.cookies?.AccessToken;
        }
        return null;
            
    }
})


/*

🔒 2. requiredAuth — Using express-jwt Middleware
Summary

This uses the express-jwt library — which automatically handles JWT verification for you.

Key Characteristics

Handles token extraction, decoding, and error responses internally.

You configure it once and apply it as middleware.

Stores the decoded JWT payload in a specific request property (here, req.auth).

Example Flow

express-jwt automatically checks for the token in:

The Authorization: Bearer <token> header, or

A cookie (req.cookies.Access_Token)

If valid, the decoded token payload is added to req.auth.

If invalid or missing, express-jwt sends a 401/403 automatically.

✅ Pros

Less boilerplate.

Clean, declarative configuration.

Well-tested library; handles many JWT edge cases.

❌ Cons

Less flexibility — if you want custom error messages or logging, you must use additional middleware.

Slightly harder to debug if something goes wrong internally.

*/