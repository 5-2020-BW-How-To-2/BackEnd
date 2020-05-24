
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('steps').del()
    .then(function () {
      // Inserts seed entries
      return knex('steps').insert([
        {id: 1, step_number: 1, instruction: "just do the thing", hack_id: 1},
        {id: 2, step_number: 1, instruction: "just do the thing", hack_id: 2},
        {id: 3, step_number: 1, instruction: "just do the thing", hack_id: 3},
        {id: 4, step_number: 2, instruction: "just do the thing a second time", hack_id: 1},
        {id: 5, step_number: 2, instruction: "just do the thing a second time", hack_id: 2},
        {id: 6, step_number: 2, instruction: "just do the thing a second time", hack_id: 3},
        {id: 7, step_number: 3, instruction: "just do the thing a third time", hack_id: 1},
        {id: 8, step_number: 3, instruction: "just do the thing a third time", hack_id: 2},
        {id: 9, step_number: 3, instruction: "just do the thing a third time", hack_id: 3},
      ]);
    });
};
