const { users } = require('./users');
const { cars } = require('./cars');
const { orders } = require('./orders');
const { inquiries } = require('./inquiries');
const { reviews } = require('./reviews');
const { favorites } = require('./favorites');
const { carImages } = require('./car_images');
const { adminActions } = require('./admin_actions');

module.exports = {
    users,
    cars,
    orders,
    inquiries,
    reviews,
    favorites,
    carImages,
    adminActions,
};
