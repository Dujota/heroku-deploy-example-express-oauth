const Student = require('../models/student');

function index(req, res, next) {
  console.log('REQ QUERY', req.query);
  console.log('user', req.user);
  // Make the query object to use with Student.find based up
  // the user has submitted the search form or now
  const modelQuery = req.query.name ? { name: new RegExp(req.query.name, 'i') } : {};
  // Default to sorting by name
  const sortKey = req.query.sort || 'name';
  Student.find(modelQuery) // {name: 'denis'}
    .sort(sortKey) // 'cohort'
    .exec(function(err, students) {
      if (err) return next(err);
      // Passing search values, name & sortKey, for use in the EJS
      // REQ.USER COMES FROM PASSPORT!!!! {} or {name:"John" ...etc}
      res.render('students/index', { students, name: req.query.name, sortKey });
    });
}

function addFact(req, res, next) {
  const student = req.user;

  student.facts.push(req.body);
  student
    .save()
    .then(() => res.redirect('/students'))
    .catch(err => {
      console.error(err);
      res.redirect('/students');
    });
}

async function delFact(req, res, next) {
  const students = await Student.find({});
  res.render('index', { students });
}

module.exports = {
  index,
  addFact,
  delFact,
};
