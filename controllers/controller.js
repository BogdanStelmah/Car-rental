exports.getPage = (req, res, next) => {
    res.status(200).json({
        text: "Hello!!"
    });
};