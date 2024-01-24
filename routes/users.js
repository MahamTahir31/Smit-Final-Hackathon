const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/Smit-Final-Hackathon", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = mongoose.Schema({
  username: String,
  name: String, 
  email: String,
  password: String, 
});

const userProjects = mongoose.Schema({
  ProjectTitle: String,
  DeveloperName: String,
  Description: String, 
  HostedURL: String
});

userSchema.plugin(plm);
userProjects.plugin(plm);

module.exports = {
  UserModel: mongoose.model("user", userSchema),
  ProjectModel: mongoose.model("project", userProjects)
};