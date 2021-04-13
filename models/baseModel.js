function BaseModel() {
	PubSub.call(this);
}
BaseModel.prototype = new PubSub(); //bad practice, better with Object.create
BaseModel.prototype.constructor = BaseModel;

BaseModel.prototype.clear = function() {};