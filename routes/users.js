const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://127.0.0.1:27017/pinterest');

// Define the User schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post', // Assuming your post model is named 'Post'
    }
  ],
  dp: {
    type: String,
    default: null, // You can modify the default value based on your requirements
  },
});

userSchema.plugin(plm);
module.exports = mongoose.model('User', userSchema);
