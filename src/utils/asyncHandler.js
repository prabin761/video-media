

const asyncHandler = (requestHandler) => async(req,res,next) =>{
    try {
        await requestHandler(req,res,next);
    } catch (error) {
        console.error(error);
        
        res.status(error.statusCode || error.code || 500).json({
            success: false,
            message: error.message || "internal server Error"
        })
    }
}

//(requestHandler) = () higher order function execution

module.exports = asyncHandler;