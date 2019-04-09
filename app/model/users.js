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
    },
    teams: [{
      type: Schema.Types.ObjectId,
      ref: 'Teams',
    }],
    department: {
      type: String,
    },
    job: {
      type: String,
    }
  });

  return mongoose.model('Users', UsersSchema);
};