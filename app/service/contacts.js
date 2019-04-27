const Service = require('egg').Service;

class ContactsService extends Service {
  async create() {
    const { ctx } = this;
    const { Contacts } = ctx.model;
    const userId = ctx.user._id;
    console.log('userId', userId);
    const contacts = new Contacts({contact: [userId]});
    const result = await contacts.save();
    return result;
  }
  async addToContactById(contactId) {
    const { ctx } = this;
    const { Contacts } = ctx.model;
    const userId = ctx.request.body.userId;
    console.log('addToContactById: contactId userId', contactId, userId);
    const result = await Contacts.updateMany(
      { _id: { $in: contactId } },
      { $addToSet: { contact: userId } }
    );
    return result;
  }
  async listByUserId() {
    const { ctx } = this;
    const { Contacts } = ctx.model;
    const userId = ctx.user._id;
    const result = await Contacts.findOne({contact: userId}).populate('contact');
    return result;
  }
  async deleteContactById(contactId) {
    const { ctx } = this;
    const { Contacts } = ctx.model;
    const userId = ctx.request.body.userId;
    console.log('deleteContactById: contactId userId', contactId, userId);
    const contacts = await Contacts.findById(contactId);
    if (!contacts) return 0;
    const newContact = [];
    contacts.contact.forEach(item => {
      console.log(item.toString());
      if (item.toString() !== userId.toString()) {
        newContact.push(item);
      }
    });
    console.log('?????????  newContact', newContact);
    const result = await Contacts.updateOne({_id: contactId}, {contact: newContact});
    return result;
  }
}

module.exports = ContactsService;