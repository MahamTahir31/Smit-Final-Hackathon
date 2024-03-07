const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/Procom-web-dev", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const paymentSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      default: null
    },
    accountNumber: {
      type: Number,
      required: true,
      min: 0
    },
    paymentAmount: {
      type: Number,
      required: true,
      min: 0
    },
    bankName: {
      type: String,
      enum: ['Habib Bank', 'United Bank', 'Meezan Bank', 'National Bank'],
      required: true
    }
  });
  


module.exports = mongoose.model("payments", paymentSchema);
