function Controller() {
	this.matrixModel = new MatrixModel();
	//через контроллер настроить связь с summaryModel и matrixModel
}
Controller.prototype.onKeyPress = function(event) {
	var key;
	switch(event.key) {
		case 'ArrowUp':
			key = 'up';
			break;
		case 'ArrowDown':
			key = 'down';
			break;
		case 'ArrowLeft':
			key = 'left';
			break;
		case 'ArrowRight':
			key = 'right';
			break;
		default:
			return;
	}

	this.matrixModel.displayActionResults(key);
}
Controller.prototype.onClickNewGame = function() {
	this.matrixModel.startNewGame();
}