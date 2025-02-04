// Middleware to refresh the session expiration on each request
const persistCookie = (req, res, next) => {
    if (req.cookies.userId) {
        const userIdCookieParsed = JSON.parse(req.cookies.userId);
        const expiryDate = new Date(userIdCookieParsed.expires);

        // Check if it expires in less then 30 minutes
        if (expiryDate - Date.now() < 30 * 60 * 1000) {
            // Add 1 hour
            userIdCookieParsed.expires = Date.now() + 60 * 60 * 1000;

            res.cookie("userId", JSON.stringify(userIdCookieParsed), {
                httpOnly: true,
                secure: true,
                maxAge: 60 * 60 * 1000, // Extend expiration to 1 hour from this request
                sameSite: "Strict"
            });
        }
    }
    
    next();
}

export default persistCookie; 