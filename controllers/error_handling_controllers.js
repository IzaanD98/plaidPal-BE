

exports.handleAllErrors = (err, req, res, next) => {
    console.log(`Server failure on end-point: ${req.method} : ${req.url}`);
    console.log(`Error received was: ${err}`);
    res.status(500).send({ msg: "server error", error: err });
};
