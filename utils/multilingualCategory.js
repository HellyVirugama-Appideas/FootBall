module.exports = (arr, req) => {
    const accepted = ['en', 'es'];
    let language = accepted.includes(req.headers['accept-language'])
        ? req.headers['accept-language']
        : 'en';
    const names = arr.map(doc => doc[language].name);
    return names;
};
