function MatrixModel() {
	BaseModel.call(this);
	this.attributes = {
		size: {
			width: 4,
			height:4
		},
		grid: [
			['', '', '', ''],
			['', '', '', ''],
			['', '', '', ''],
			['', '', '', '']
		]
	}

	var instance = this; // Singleton
	MatrixModel = function() {
		return instance;
	}

	//Needed to detect defeat
	var freeCellCount = this.attributes.size.width * this.attributes.size.height;
	var emptyCells = ['00', '01', '02', '03', '10', '11', '12', '13', '20', '21', '22', '23','30', '31', '32', '33'];
	var isFirstRender = true;

	this.startNewGame();
}

MatrixModel.prototype = Object.create(BaseModel.prototype);
MatrixModel.prototype.constructor = MatrixModel;

MatrixModel.prototype.displayActionResults = function(key) { // фасадная функция
	if(key === 'right') {
		this.moveRight();
	} else if(key === 'left') {
		this.moveLeft();
	}
	this.publish('changeData');
}

// clear cells
function clearCells (arg) {
	for(i = 0; i < arg.size.height; i += 1) {
		for(j = 0; j < arg.size.width; j += 1) {
			arg.grid[i][j] = '';
			arg.emptyCells = ['00', '01', '02', '03', '10', '11', '12', '13', '20', '21', '22', '23','30', '31', '32', '33'];
		}
	}
}

//modify clear cells after filling
function modifyClearCells(arg, row, column) {
	var i = arg.emptyCells.indexOf(String(row) + String(column));
	arg.emptyCells.splice(i, 1);
}

// find random empty cell
function randomCell(arg) {
	var q = arg.emptyCells[Math.round(Math.random() * (arg.emptyCells.length - 1))];
	try {
		q = [q.split('', 2)][0];
		return q;
	} catch(e) {
		console.log('try again'); // need normal code error - undefined is not iterable (cannot read property Symbol(Symbol.iterator))
	}
}

// find random number in 2 and 4
function randomNumber() {
	var n = Math.round(Math.random() * 2 + 2);
	if (n !== 1) {
		n = n - n % 2;
	} else {
		n = n + n % 2;
	}
	return n;
}

function fillRandomCell([r, c], arg) {
	[r, c] = randomCell(arg);
	modifyClearCells(arg, r, c);
	return arg.grid[r][c] = 2;
}

function sumRightRow(arr) {
	var j;
	for(j = arr.length - 1; j > 0; j -= 1) {
		if(arr[j] === arr[j - 1]) {
			arr[j] = arr[j - 1] + arr[j];
			arr[j - 1] = 0;
		}
	}
	return arr;
}

function sumLeftRow(arr) {
	var i;
	for(i = 0; i < arr.length - 1; i += 1) {
		if(arr[i] === arr[i + 1]) {
			arr[i] = arr[i + 1] + arr[i];
			arr[i + 1] = 0;
		}
	}
	return arr;
}

//sum and align right row
function alignRight(row) {
	var i, newRow = [];
	row = [+row[0], +row[1], +row[2], +row[3]];

	if((row[0] + row[1] + row[2] + row[3]) === 0) {
		newRow = row;
		return newRow;
	} else {
		for(i = 0; i < row.length; i += 1) {
			if(row[i] > 0) {
				newRow.push(row[i]);
			}
		}
		sumRightRow(newRow).filter(cell => cell > 0);
		
		if(newRow.length < row.length) {
			var j = new Array(row.length - newRow.length).fill(0);
			newRow = j.concat(newRow);
		}

		}
	return newRow;		
}

//sum and align left row
function alignLeft(row) {
	var i, newRow = [];
	row = [+row[0], +row[1], +row[2], +row[3]];

	if((row[0] + row[1] + row[2] + row[3]) === 0) {
		newRow = row;
		return newRow; 
	} else {
		for(i = 0; i < row.length; i += 1) {
			if(row[i] > 0) {
				newRow.push(row[i]);
			}
		}
		sumLeftRow(newRow).filter(cell => cell > 0);

		if(newRow.length < row.length) {
			var j = new Array(row.length - newRow.length).fill(0);
			newRow = newRow.concat(j);
		}
		}
	return newRow;		
}
	

MatrixModel.prototype.moveRight = function() {
	var i, k, m, maxNumber = 4, row = [];
		for(k = 0; k < maxNumber; k += 1) {
			row = alignRight(this.attributes.grid[k]);
			for(i = 0; i < maxNumber; i += 1) {
				if(row[i] === 0) {
					this.attributes.grid[k][i] = '';
					if(!this.attributes.emptyCells.includes((String(k) + (i)))){
						this.attributes.emptyCells.push(String(k) + (i));
					}
				} else {
					if(!this.attributes.grid[k][i]) {
						modifyClearCells(this.attributes, k, i);
					}
					this.attributes.grid[k][i] = row[i];
				}
		}
	}
	if(this.attributes.emptyCells.length !== 0) fillRandomCell(randomCell(this.attributes), this.attributes);
	this.publish('changeData');	
}

MatrixModel.prototype.moveLeft = function() {
	var i, k, m, maxNumber = 4, row = [];
		for(k = 0; k < maxNumber; k += 1) {
			row = alignLeft(this.attributes.grid[k]);
			for(i = 0; i < maxNumber; i += 1) {
				if(row[i] === 0) {
					this.attributes.grid[k][i] = '';
					if(!this.attributes.emptyCells.includes((String(k) + (i)))){
						this.attributes.emptyCells.push(String(k) + (i));
					}
				} else {
					if(!this.attributes.grid[k][i]) {
						modifyClearCells(this.attributes, k, i);
					}
					this.attributes.grid[k][i] = row[i];
				}
		}
	}
	if(this.attributes.emptyCells.length !== 0) fillRandomCell(randomCell(this.attributes), this.attributes);
	this.publish('changeData');	
}


MatrixModel.prototype.startNewGame = function() {
	var row, column, i, initCellsNumber = 2;
	
	clearCells(this.attributes);

	for(i = 0; i < initCellsNumber; i += 1) {
		if(this.attributes.emptyCells.length !== 0) fillRandomCell(randomCell(this.attributes), this.attributes);
	}
	this.publish('changeData');	
}