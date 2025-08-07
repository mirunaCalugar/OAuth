const mongoose = require('mongoose');
 
const OauthClientSchema = new mongoose.Schema({

  client_id: { type: String, required: true, unique: true },

  client_secret: { type: String, required: true }

});
 
module.exports = mongoose.model('OauthClient', OauthClientSchema);

 