'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const RefundAmountSchema = new Schema({
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Projects',
      require: true,
    },
    maxTravel: {  // 差旅费报销限额
      type: Number,
    },
    leftTravel: {  // 剩余差旅费报销额度
      type: Number,
    },
    maxStuff: {  // 材料费
      type: Number,
    },
    leftStuff: {
      type: Number,
    },
    maxPublish: {  // 文献出版费
      type: Number,
    },
    leftPublish: {
      type: Number,
    },
    maxLabor: {  // 劳务费
      type: Number,
    },
    leftLabor: {
      type: Number,
    },
    maxConsult: {  // 专家咨询费
      type: Number,
    },
    leftConsult: {
      type: Number,
    },
    maxDevice: {  // 设备费
      type: Number,
    },
    leftDevice: {
      type: Number,
    },
  });

  return mongoose.model('RefundAmount', RefundAmountSchema);
};