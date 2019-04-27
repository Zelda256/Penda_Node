'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ContactsSchema = new Schema({
    contact: [{
      type: Schema.Types.ObjectId,
      ref: 'Users',
      require: true,
    }],
  });

  return mongoose.model('Contacts', ContactsSchema);
};