export default {
    // Middleware to refresh the session expiration on each request
    persistCookie(req, res, next) {
        if (req.cookies.userId) {
            const userIdCookieParsed = JSON.parse(req.cookies.userId);
            const expiryDate = new Date(userIdCookieParsed.expires);
    
            // Check if it expires in less then 30 minutes
            if (expiryDate - Date.now() < 30 * 60 * 1000) {
                userIdCookieParsed.expires = Date.now() + 60 * 60 * 1000;
    
                res.cookie("userId", JSON.stringify(userIdCookieParsed), {
                    httpOnly: true,
                    maxAge: 60 * 60 * 1000, // Extend expiration to 1 hour from this request
                    sameSite: "Lax"
                });
            }
        }
        next();
    }
}