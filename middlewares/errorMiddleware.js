// Error middleware
const errorMiddleware = (err, req, res, next) => {
    console.log(err); // Use console.error for better visibility of errors
    const defaultErrors ={
        statusCode : 500,
        message: err,
    }
    // missing filed error
    if(err.name === 'ValidationError'){
        defaultErrors.statusCode = 400;
        defaultErrors.message = Object.values(err.errors)
        .map((item) => item.message)
        .json(',')
    } 
    // duplicate values fill kanai par hum yai error dete hai 
    if(err.code && err.code === 11000){
        defaultErrors.statusCode =400;
        defaultErrors.message = `${Object.keys(
            err.keyValue
        )} field has to be unique`;
    }
    res.status(defaultErrors.statusCode).json({message: defaultErrors.message})
};

export default errorMiddleware;
