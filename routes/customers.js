const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/Procom-web-dev", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const customerSchema = mongoose.Schema({
  username: String,
  accountNumber: Number, 
  email: String,
  password: String, 
});


customerSchema.plugin(plm);


module.exports = mongoose.model("customer", customerSchema);
