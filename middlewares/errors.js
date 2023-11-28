const NotFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404); // Set the status code to 404 for "Not Found"
    next(error);
    }

const errorhandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Use res.statusCode, not res.StatusCode
    res.status(statusCode).json({ message: err.message});
    }    

module.exports= {
    NotFound,
    errorhandler
}