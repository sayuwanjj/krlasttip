export const requestLoggerMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    
    console.log(`[${timestamp}] ${method} ${url}`);
    
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('  Body:', JSON.stringify(req.body));
    }
    
    const originalSend = res.send;
    res.send = function(data) {
        console.log(`  Status: ${res.statusCode}`);
        originalSend.call(this, data);
    };
    
    next();
};
