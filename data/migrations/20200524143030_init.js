
exports.up = function(knex) {
    return knex.schema.createTable("users", user=>{
        user.increments();
        user.string("username", 24).notNullable().unique();
        user.string("password", 48).notNullable();
    })
    .createTable("hacks", lh=>{
        lh.increments();
        lh.string("title", 255).notNullable();
        lh.string("description", 1000).notNullable();
        lh.integer("score").notNullable();
        lh.integer("user_id").unsigned().notNullable().references("id").inTable("users").onUpdate("CASCADE").onDelete("CASCADE");
    })
    .createTable("steps", hs=>{
        hs.increments();
        hs.integer("step_number").notNullable();
        hs.string("instruction", 300).notNullable();
        hs.integer("hack_id").unsigned().notNullable().references("id").inTable("hacks").onUpdate("CASCADE").onDelete("CASCADE")
    })
    .createTable("comments", com=>{
        com.increments();
        com.string("comment_text", 200).notNullable();
        com.integer("hack_id").unsigned().notNullable().references("id").inTable("hacks").onUpdate("CASCADE").onDelete("CASCADE");
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("users").dropTableIfExists("hacks").dropTableIfExists("steps").dropTableIfExists("comments")
  };
  