import createHttpError from "http-errors"

export const errorHandler = ((err, req, res, next) => {
    if(err instanceof createHttpError.HttpError){
        return res.status(err.status).json({
            message:err.message || err.name
        })
    }

  res.status(500).json({ message: err.message });
})