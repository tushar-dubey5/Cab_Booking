const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        try {
            await requestHandler(req, res, next);
        } catch (err) {
            // If next exists (Express middleware), use it
            if (typeof next === 'function') {
                next(err);
            } else {
                // Fallback for non-Express usage
                console.error("Unhandled error:", err);
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    };
};

export { asyncHandler };


// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}


// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }