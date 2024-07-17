const asyncHandler = (requestHandler) => { 
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch(error => next(error))
    }
}
export {asyncHandler}

// const assFn = (fn) => async (req, res, next) => {
//     try{
//         await fn(req, res, next)
//     } catch (error){
//         return res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }