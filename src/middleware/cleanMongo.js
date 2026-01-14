/**
 * Custom middleware to sanitize request data against NoSQL query injection.
 * Removes any keys starting with '$' or containing '.' (if we want to be strict, but mainly $)
 * Replaces 'express-mongo-sanitize' which is incompatible with Express 5.
 */

const sanitize = (obj) => {
    if (obj instanceof Object) {
        for (const key in obj) {
            if (/^\$/.test(key)) {
                delete obj[key];
            } else {
                sanitize(obj[key]);
            }
        }
    }
    return obj;
};

export const mongoSanitize = () => (req, res, next) => {
    sanitize(req.body);
    sanitize(req.params);
    sanitize(req.query);
    next();
};
