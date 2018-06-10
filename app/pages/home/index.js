const template = require('./index.marko');
const transactions = [];

module.exports = (req, res) => {
    res.marko(template, {
        transactions
    });
}