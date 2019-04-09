'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ProcessSchema = new Schema({
    name: {
      type: String,
      require: true,
    },
    cost: {
      type: Number,
    },
    member: [{
      type: Schema.Types.ObjectId,
      ref: 'Users',
    }],
    status: {
      type: Number,
      require: true,
    },
    startDate: {
      type: Date,
    },
    deadLine: {
      type: Date,
    },
  });

  return mongoose.model('Process', ProcessSchema);
};