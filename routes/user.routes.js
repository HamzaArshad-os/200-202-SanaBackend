const users = require("../controllers/user.controllers");
const auth = require("../lib/authentication");

module.exports = function (app) {

   app.route("/users")  //you had "user" before changed to users -Hamza
      .get(auth.isAuthenticated, users.getAll)
      .post( auth.isAuthenticated,users.NewUser);

   app.route("/login")
      .post(users.loginUser);

   app.route("/logout")
      .post(auth.isAuthenticated, users.logoutUser);
}