'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const RefundSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      require: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Projects',
      require: true,
    },
    processId: {
      type: Schema.Types.ObjectId,
      ref: 'Process',
      require: true,
    },
    type: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7], 
      // 差旅费，材料费、文献出版费、劳务费、专家咨询费、设备费
      require: true,
    },
    value: {
      type: Number,
      require: true,
    },
    date: {
      type: Date,
      require: true,
    }
  });

  return mongoose.model('Refunds', RefundSchema);
};