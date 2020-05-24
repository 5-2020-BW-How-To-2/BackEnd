
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('comments').del()
    .then(function () {
      // Inserts seed entries
      return knex('comments').insert([
        {id: 1, comment_text: 'this is awesome!', hack_id: 1},
        {id: 2, comment_text: 'this is some great content', hack_id: 2},
        {id: 3, comment_text: 'hack is terrible', hack_id: 3},
        {id: 4, comment_text: 'this is rad!', hack_id: 1},
        {id: 5, comment_text: '10/10 -ign', hack_id: 2},
        {id: 6, comment_text: 'you could have been anything when you grew up, and you chose to be a disappointment', hack_id: 3},
        {id: 7, comment_text: 'this is super amazing!', hack_id: 1},
        {id: 8, comment_text: 'this is incredible!', hack_id: 2},
        {id: 9, comment_text: 'not cool dude', hack_id: 3},
      ]);
    });
};
