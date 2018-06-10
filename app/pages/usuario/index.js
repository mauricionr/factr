const template = require('./index.marko');

module.exports = (req, res) => {
    res.marko(template, {});
}