function rateLimit(req, res, next) {
    const remaining = res.locals.rateLimitInfo ? res.locals.rateLimitInfo.remaining : null;
    if (remaining !== null && remaining <= 0) {
        return res.status(429).json({ message: 'Rate limit exceeded. Please try again later.' });
    }
    next();
}

module.exports = rateLimit;
