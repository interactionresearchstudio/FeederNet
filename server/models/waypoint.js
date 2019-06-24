var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var waypointSchema = new Schema({
    bird: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bird'
    },
    feeder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'feeder'
    },
    datetime: String
});

waypointSchema.methods.addBird = function(bird_id) {
    this.bird = bird_id;
    return this.save();
};

waypointSchema.methods.addFeeder = function(feeder_id) {
    this.feeder = feeder_id;
    return this.save();
};

waypointSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('waypoint', waypointSchema);
