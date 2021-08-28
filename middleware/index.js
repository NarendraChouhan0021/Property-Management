const validate = (req, res, required) => {
  for (let key in required) {
    req.check(key, key + " must not be empty").not().isEmpty();
  }
  return req.validationErrors();
};

module.exports = { validate };
