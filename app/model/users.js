'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UsersSchema = new Schema({
    name: { 
      type: String,
      require: true,
    },
    password: { 
      type: String,
      require: true,
    },
    avatar: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    }
  });

  return mongoose.model('Users', UsersSchema);
};