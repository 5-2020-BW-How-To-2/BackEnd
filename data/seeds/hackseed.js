
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('hacks').del()
    .then(function () {
      // Inserts seed entries
      return knex('hacks').insert([
        {id: 1, title: 'Life Hack #1', description: "This is the first life hack ever", score: 128, user_id: 1},
        {id: 2, title: 'Life Hack #2', description: "This is the second life hack ever", score: 299, user_id: 1},
        {id: 3, title: 'Life Hack #3', description: "This is the third life hack ever", score: -19, user_id: 2},
      ]);
    });
};

