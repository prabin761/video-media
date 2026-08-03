

const asyncHandler = (requestHandler) = async(req,res,net) =>{
    try {
        await requestHandler(req,res,next);
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}

//(requestHandler) = () higher order function execution

module.exports = asyncHandler;