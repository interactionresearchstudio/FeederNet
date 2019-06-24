var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
    type: String,
    feeder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'feeder'
    },
    ip: String,
    datetime: String
});

eventSchema.methods.addFeeder = function(feeder_id) {
    this.feeder = feeder_id;
    return this.save();
};

eventSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('event', eventSchema);
