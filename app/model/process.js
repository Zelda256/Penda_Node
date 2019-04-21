'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ProcessSchema = new Schema({
    name: {
      type: String,
      require: true,
    },
    budge: {
      type: Number,
    },
    cost: {
      type: Number,
    },
    member: [{
      type: Schema.Types.ObjectId,
      ref: 'Users',
    }],
    status: {
      type: Number,  // 1将开始 2进行中 3已完成
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