const awesomeFunction = (req, res, next) => {
    res.json('Aubrey Thoeun');
};

const returnAnotherPerson = (req, res, next) => {
    res.json('Super awesome person');
};

module.exports = {awesomeFunction, returnAnotherPerson};