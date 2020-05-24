# **************** Documentation for Use **************** 

## Endpoints

POST: /api/register
- requires username and password
- success will return the created account information (201)
- failure to provide either username or password will throw error 400
- failure to provide a unique username will throw error 500


POST: /api/login
- requires a valid username and password
- success will return a json web token (authentication)
- incorrect username or password will throw error 401
- failure to provide a username or password will throw error 400
- if anything else goes wrong it will throw error 500


GET: /api/users
- requires a token
- will return an array of usernames and (hashed) passwords (200)
- probably not a good endpoint to incorporate into the project, but it currently serves as a way to list all registered users and test whether or not authentication is working
- if something goes wrong it will throw error 500


GET: /api/users/:id
- requires a token
- will return the information on the user with the specified id (200)
- if user does not exist it will throw error 404
- if something else goes wrong it will throw error 500


GET: /api/hacks
- requires a token
- returns an array of all the life hacks on record (200)
- if something goes wrong it will throw error 500


GET: /api/hacks/:id
- requires a token
- :id is the "id" property of the life hack being referenced
- returns information on a specified life hack (200)
- if specified life hack does not exist will throw error 404
- if something else goes wrong it will throw error 500


POST: /api/hacks
- requires a token
- requires an object with title and description property
- will return the created object (201)
- if title or description is missing it will throw error 400
- if something else goes wrong it will throw error 500


PUT: /api/hacks/:id
- requires a token
- requires an object with title and description property
- will return an updated object (200)
- if title or description is missing it will throw error 400
- if specified life hack does not exist it will throw error 404
- if something else goes wrong it will throw error 500
- if edit is attempted by an account that did not create the post, it will throw error 403 (this was a very difficult and annoying feature to implement, but it works and I am v proud of it)


DELETE: /api/hacks/:id
- requires a token
- will return the full array of hacks, minus the deleted one
- if delete is attempted by an account that did not create the post, it will throw error 403
- will also delete all steps and comments associated with the life hack


PATCH: /api/hacks/:id/upvote
- requires a token
- :id is the "id" property of the life hack being referenced
- will return the life hack object with the score increased by 1
- if :id is invalid, will throw error 404
- if something else goes wrong, will throw error 500


PATCH: /api/hacks/:id/downvote
- requires a token
- :id is the "id" property of the life hack being referenced
- will return the life hack object with the score decreased by 1
- if :id is invalid, will throw error 404
- if something else goes wrong, will throw error 500


GET: /api/hacks/:id/steps
- requires a token
- will return the full array of steps for the given life hack (200)
- if request is successful but no steps are listed for the specified life hack, will return {message: "no steps for given life hack"} (200)
- if hack id is invalid, will throw error 404
- if something else goes wrong it will throw error 500


POST: /api/hacks/:id/steps
- requires a token
- requires an object with a step_number (integer) and instruction property
- :id is the "id" property of the life hack the step will be associated with
- returns the created step as an object (201)
- if step_number or instruction is missing, or step_number is not an integer, will throw error 400
- if something else goes wrong it will throw error 500
- if adding a step is attempted by an account that did not create the life hack, it will throw error 403


PUT: /api/hacks/:id/steps/:stepId
- requires a token
- :id is the "id" property of the life hack the step is associated with
- :stepId is the "id" property of the step, NOT the "step_number"
- requires an object with a step_number (integer) and instruction property
- returns the updated step object (200)
- if either :id or :stepId is invalid, will throw error 404
- if the step_number or instruction property is missing, it will throw error 400
- if something else goes wrong it will throw error 500
- if updating a step is attempted by an account that did not create the life hack, it will throw error 403


DELETE: /api/hacks/:id/steps/:stepId
- requires a token
- :id is the "id" property of the life hack the step is associated with
- :stepId is the "id" property of the step, NOT the "step_number"
- returns the full array of steps for the specified life hack, minus the deleted one
- if either :id or :stepId is invalid, will throw error 404
- if deleting a step is attempted by an account that did not create the life hack, it will throw error 403


/////// Quick note about comment endpoints (below)
Given that a comment section is not part of mvp or stretch, if you want to add a comment section I added some basic functionality for it
For that reason though, comments are not linked to any accounts, and therefore are unable to be edited after posting.
They can, however, be deleted by the creator of the life hack

GET: /api/hacks/:id/comments
- requires a token
- :id is the "id" property of the life hack the comment is associated with
- returns an array of all comments associated with the life hack
- if :id is invalid will throw error 404
- if something else goes wrong it will throw error 500


POST: /api/hacks/:id/comments
- requires a token
- :id is the "id" property of the life hack the comment is associated with
- requires an object with a "comment_text" property
- returns the created comment (201)
- if comment_text is missing, will throw error 400
- if :id is invalid, will throw error 404
- if something else goes wrong it will throw error 500


DELETE: /api/hacks/:id/comments/:commentId
- requires a token
- :id is the "id" property of the life hack the comment is associated with
- :commentId is the "id" property of the comment
- if either :id or :commentId is invalid throws error 404
- if something else goes wrong throws error 500
- if comment delete attempt is performed by an account that didn't create the life hack, throws error 403



## DATA SHAPES
The format listed below is how the objects will return. 
Properties marked with "//" you should NOT send in your requests
Properties marked with "#" you SHOULD send in your requests
(Keep in mind that all of the bulletpoints are properties in an object. I am just terrible at formatting .md documents)

### Accounts:
    - //id: (integer, auto-generated)
    - # username: (string, required, max length is 24 characters)
    - # password: (string, required, max length is 48 characters)

### Life Hacks
    - //id: (integer, auto-generated)
    - # title: (string, required, max length 255)
    - # description: (string, required, max length 1000)
    - //score: (integer, not required, will be automatically set to 1 on creation)
    - //user_id: (integer, auto-generated, linked to the id of the account that posts the life hack)

### Life Hack Steps
    - //id: (integer, auto-generated)
    - ## step_number: (integer, required)
    - ## instruction: (string, required, max length 300)
    - //hack_id: (integer, auto-generated, linked to the id of the life hack it is associated with)

### Comments
    - //id: (integer, auto-generated)
    - ## comment_text: (string, required, max length 200)
    - //hack_id: (integer, auto-generated, linked to the life hack it is associated with) 