'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ProjectssSchema = new Schema({
    id: {   // 项目id 由随机数生成
      type: String,
      require: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
    startDate: {
      type: Date,
      require: true,
    },
    team: [{
      type: Schema.Types.ObjectId,
      ref: 'Users',
    }],
    name: {
      type: String,
      require: true,
    },
    deadLine: {
      type: Date,
      require: true,
    },
    progress: {
      type: Number,
      require: true,
    },
    process: [{
      type: Schema.Types.ObjectId,
      ref: 'Process',
    }],
    budget: {
      type: Number,
    },
    moneyType: {
      type: String,
      enum: ['RMB', 'Dollar'],
    },
    status: {
      type: Number,
      enum: [1, 2, 3],  // 1未开始  2进行中  3已完成
    },
    priority: {
      type: Number,
      enum: [1, 2, 3],  // 1普通  2紧急 3非常紧急
    },
    description:{
      type: String,
    },
    remark: {
      type: String
    },
  });

  return mongoose.model('Projects', ProjectssSchema);
};