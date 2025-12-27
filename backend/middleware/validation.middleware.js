// Middleware to validate ID parameters
export const validateId = (paramName = 'id') => {
    return (req, res, next) => {
        const id = req.params[paramName];

        if (!id) {
            return res.status(400).json({
                success: false,
                message: `${paramName} is required`
            });
        }

        // Check if ID is a valid integer
        const parsedId = parseInt(id, 10);
        
        if (isNaN(parsedId) || parsedId <= 0) {
            return res.status(400).json({
                success: false,
                message: `Invalid ${paramName}. Must be a positive integer.`
            });
        }

        // Replace the param with parsed integer
        req.params[paramName] = parsedId;
        
        next();
    };
};

