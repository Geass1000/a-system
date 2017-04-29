'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let connection = require('../config/mongodb.database');

/**
 * name - название типа текстур;
 *
 */
let textureCategorySchema = new Schema({
	name : {
		type : String,
		unique : true,
		require : true
	}
});

/**
 * Получить все типы текстур из БД "TextureCategorys"
 *
 * @param  {Object} user user info
 */
textureCategorySchema.statics.getAllTextureCategories = function () {
	return this.find().exec();
};

module.exports = connection.model('Texture_Category', textureCategorySchema);