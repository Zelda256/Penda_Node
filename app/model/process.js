'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ProcessSchema = new Schema({
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Projects',
    },
    process: [{
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
      startDate: {
        type: Date,
      },
      deadLine: {
        type: Date,
      },
    }],
  });

  return mongoose.model('Process', ProcessSchema);
};