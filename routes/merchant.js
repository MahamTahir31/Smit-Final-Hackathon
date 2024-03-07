const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/Procom-web-dev", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const merchantSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // Add more fields as needed
  });
  
  const Merchant = mongoose.model('merchant', merchantSchema);
  
  module.exports = Merchant;