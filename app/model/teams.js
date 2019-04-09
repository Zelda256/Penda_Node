'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const TeamsSchema = new Schema({
    name: {
      type: String,
      require: true
    },
    member: [{
      type: Schema.Types.ObjectId,
      ref: 'Users',
    }]
  });

  return mongoose.model('Teams', TeamsSchema);
};