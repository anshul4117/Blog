import xss from 'xss';


//   Clean a string or object from XSS attacks

const clean = (data) => {
    if (!data) return data;

    if (Array.isArray(data)) {
        return data.map(item => clean(item));
    }

    if (typeof data === 'object') {
        return Object.keys(data).reduce((acc, key) => {
            acc[key] = clean(data[key]);
            return acc;
        }, {});
    }

    if (typeof data === 'string') {
        return xss(data);
    }

    return data;
};


export const xssSanitizer = (req, res, next) => {
    if (req.body) req.body = clean(req.body);
    if (req.query) Object.assign(req.query, clean(req.query));
    if (req.params) Object.assign(req.params, clean(req.params));
    next();
};
