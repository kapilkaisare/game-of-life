var WorldConfiguration = (function (){
	var
		num_rows = null,
		num_cols = null,
		default_rows = 10,
		default_cols = 10,
		rowId = 'rows',
		colId = 'columns',
		useBtnId = 'use-config',
		useBtn = null,
		_getRows = function () {
			return num_rows;
		},
		_getCols = function () {
			return num_cols;
		},
		_readRowCount = function () {
			var rowInput = document.getElementById(rowId);
			if (rowInput.value === '') {
				rowInput.value = default_rows;
			}
			num_rows = rowInput.value;
		},
		_readColCount = function () {
			var colInput = document.getElementById(colId);
			if (colInput.value === '') {
				colInput.value = default_cols;
			}
			num_cols = colInput.value;
		},
		_loadCounts = function () {
			_readRowCount();
			_readColCount();
		},
		_init = function (listeners) {
			useBtn = document.getElementById(useBtnId);
			useBtn.onclick = listeners.useClick;
		};

	return {
		readRowCount: _readRowCount,
		readColCount: _readColCount,
		loadCounts: _loadCounts,
		getRows: _getRows,
		getCols: _getCols,
		init: _init
	};
})();


var ActionPanel = (function () {
	var
		startBtnId = 'start',
		startBtn = null,
		stopBtnId = 'stop',
		stopBtn = null,
		resetBtnId = 'reset',
		resetBtn = null,
		_show = function () {
			startBtn.style.display = 'inline';
			stopBtn.style.display = 'inline';
			resetBtn.style.display = 'inline';
		},
		_hide = function () {
			startBtn.style.display = 'none';
			stopBtn.style.display = 'none';
			resetBtn.style.display = 'none';
		},
		_init = function (listeners) {
			startBtn = document.getElementById(startBtnId);
			stopBtn = document.getElementById(stopBtnId);
			resetBtn = document.getElementById(resetBtnId);

			startBtn.onclick = listeners.startClick;
			stopBtn.onclick = listeners.stopClick;
			resetBtn.onclick = listeners.resetClick;

			this.hide();
		};
	return {
		init: _init,
		hide: _hide,
		show: _show
	};
})();

var World = (function () {
	return function (eventor) {
		var
			renderContainerId = 'world-container',
			constructCellId = function (row, col) {
				return 'cell_' + row + '_' + col;
			},
			constructRowId = function (row) {
				return 'row_' + row;
			},
			renderCell = function (row, col) {
				var cell = document.createElement('td');
				cell.setAttribute('id', constructCellId(row, col));
				cell.style.padding = '5px';
				cell.style.border = 'solid 1px';
				cell.onclick = function () {
					eventor.fireEvent('cellToggled', row, col);
				};
				return cell;
			},
			renderRow = function (row, col) {
				var rowEl = document.createElement('tr');
				rowEl.setAttribute('id', constructRowId(row));
				for (var i = 0; i < col; i++) {
					rowEl.appendChild(renderCell(row, i));
				}
				return rowEl;
			},
			onCellAlive = function (row, col) {
				document.getElementById(constructCellId(row, col)).style.background = '#000000';
			},
			onCellDead = function (row, col) {
				document.getElementById(constructCellId(row, col)).style.background = '#FFFFFF';
			};

		eventor.subscribeEvent('cellAlive', onCellAlive);
		eventor.subscribeEvent('cellDead', onCellDead);

		this.clearWorld = function () {
			if (this.worldHolder) {
				while (this.worldHolder.firstChild) {
					this.worldHolder.removeChild(this.worldHolder.firstChild);
				}
			}
		};

		this.renderWorld = function (rows, cols) {
			var table = document.createElement('table');

			this.worldHolder = document.getElementById(renderContainerId);
			this.clearWorld();

			for (var i = 0; i < rows; i++) {
				table.appendChild(renderRow(i, cols));
			}

			table.style.padding = '5px';
			table.style.border = 'solid 1px';

			this.worldHolder.appendChild(table);

		};

		return this;
	};
})();

var Eventor = (function () {

	return function () {
		var events = {};

		this.registerEvent = function (eventName) {
			events[eventName] = {
				subscriptions: []
			};
		};

		this.subscribeEvent = function (eventName, func) {
			if (events[eventName]) {
				events[eventName].subscriptions.push(func);
			}
		};

		this.fireEvent = function (eventName) {
			var args = Array.prototype.slice.call(arguments, 1);
			if (events[eventName]) {
				for (var i = 0, n = events[eventName].subscriptions.length; i < n; i++) {
					events[eventName].subscriptions[i].apply(this, args);
				}
			}
		};

		this.clearSubscriptions = function (eventName) {
			if (events[eventName]) {
				events[eventName].subscriptions = [];
			}
		};

		return this;
	};

})();

var Generation = (function () {
	return function (eventor) {

		var State = function (initialState) {
			this.isAlive = initialState || false;
			return this;
		};


		var
			that = this,
			onCellToggled = function (row, col) {
				if (that.state[row][col].isAlive) {
					that.state[row][col].isAlive = false;
					eventor.fireEvent('cellDead', row, col);
				} else {
					that.state[row][col].isAlive = true;
					eventor.fireEvent('cellAlive', row, col);
				}
			},
			makeRow = function (cols) {
				var row = [];
				for (var i = 0; i < cols; i++) {
					row.push(new State(false));
				}
				return row;
			},
			getNorthNeighbor = function (row, col) {
				if (that.state[row -1] && that.state[row - 1][col]) {
					return that.state[row - 1][col];
				} else {
					return false;
				}
			},
			getNorthEastNeighbor = function (row, col) {
				if (that.state[row -1] && that.state[row - 1][col + 1]) {
					return that.state[row - 1][col + 1];
				} else {
					return false;
				}
			},
			getEastNeighbor = function (row, col) {
				if (that.state[row] && that.state[row][col + 1]) {
					return that.state[row][col + 1];
				} else {
					return false;
				}
			},
			getSouthEastNeighbor = function (row, col) {
				if (that.state[row + 1] && that.state[row + 1][col + 1]) {
					return that.state[row + 1][col + 1];
				} else {
					return false;
				}
			},
			getSouthNeighbor = function (row, col) {
				if (that.state[row + 1] && that.state[row + 1][col]) {
					return that.state[row + 1][col];
				} else {
					return false;
				}
			},
			getSouthWestNeighbor = function (row, col) {
				if (that.state[row + 1] && that.state[row + 1][col - 1]) {
					return that.state[row + 1][col - 1];
				} else {
					return false;
				}
			},
			getWestNeighbor = function (row, col) {
				if (that.state[row] && that.state[row][col - 1]) {
					return that.state[row][col - 1];
				} else {
					return false;
				}
			},
			getNorthWestNeighbor = function (row, col) {
				if (that.state[row - 1] && that.state[row - 1][col - 1]) {
					return that.state[row - 1][col - 1];
				} else {
					return false;
				}
			},
			findNeighborCountForCellAt = function (row, col){
				var neighborCount = 0;
				if (getNorthNeighbor(row, col) && getNorthNeighbor(row, col).isAlive) {
					neighborCount = neighborCount + 1;
				}
				if (getNorthWestNeighbor(row, col) && getNorthWestNeighbor(row, col).isAlive) {
					neighborCount = neighborCount + 1;
				}
				if (getNorthEastNeighbor(row, col) && getNorthEastNeighbor(row, col).isAlive) {
					neighborCount = neighborCount + 1;
				}
				if (getWestNeighbor(row, col) && getWestNeighbor(row, col).isAlive) {
					neighborCount = neighborCount + 1;
				}
				if (getEastNeighbor(row, col) && getEastNeighbor(row, col).isAlive) {
					neighborCount = neighborCount + 1;
				}
				if (getSouthNeighbor(row, col) && getSouthNeighbor(row, col).isAlive) {
					neighborCount = neighborCount + 1;
				}
				if (getSouthWestNeighbor(row, col) && getSouthWestNeighbor(row, col).isAlive) {
					neighborCount = neighborCount + 1;
				}
				if (getSouthEastNeighbor(row, col) && getSouthEastNeighbor(row, col).isAlive) {
					neighborCount = neighborCount + 1;
				}
				return neighborCount;
			};

		eventor.subscribeEvent('cellToggled', onCellToggled);

		this.state = null;
		this.nextState = null;

		this.make = function (rows, cols) {
				this.state = [];
				for (var i = 0; i < cols; i++) {
					this.state.push(makeRow(cols));
					for (var j = 0; j < cols; j++) {
						eventor.fireEvent('cellDead', i, j);
					}
				}
		};

		this.computeNextState = function () {
			this.nextState = [];
			for (var i = 0, m = this.state.length; i < m; i++) {
				this.nextState[i] = [];
				for (var j = 0, n = this.state[i].length; j < n; j++) {
					var neighborCount = findNeighborCountForCellAt(i, j);
					this.nextState[i][j] = null;
					if (this.state[i][j].isAlive && neighborCount < 2) {
						this.nextState[i][j] = new State(false);
						eventor.fireEvent('cellDead', i, j);
					} else if (this.state[i][j].isAlive && (neighborCount == 2 || neighborCount == 3)) {
						this.nextState[i][j] = new State(true);
						eventor.fireEvent('cellAlive', i, j);
					} else if (this.state[i][j].isAlive && neighborCount > 3) {
						this.nextState[i][j] = new State(false);
						eventor.fireEvent('cellDead', i, j);
					} else if (!this.state[i][j].isAlive && neighborCount == 3) {
						this.nextState[i][j] = new State(true);
						eventor.fireEvent('cellAlive', i, j);
					} else {
						this.nextState[i][j] = new State(false);
						eventor.fireEvent('cellDead', i, j);
					}
				}
			}
			this.state = JSON.parse(JSON.stringify(this.nextState));
		};

		return this;
	};
})();

var Gol = (function (){
	var
		world = null,
		generation = null,
		supportedEvents = [
			'cellToggled',
			'cellAlive',
			'cellDead'
		],
		_run = function (config, action) {
			var eventBridge = new Eventor();

			for (var i = 0, n = supportedEvents.length; i < n; i++) {
				eventBridge.registerEvent(supportedEvents[i]);
			}

			var
				running = false,
				generateNewState = function () {
					generation.computeNextState();
				},
				runGenerations = function () {
					if (running) {
						generateNewState();
						setTimeout(runGenerations, 1000);
					}
				},
				onUseClick = function () {
					world = new World(eventBridge);
					generation = new Generation(eventBridge);

					config.loadCounts();
					world.renderWorld(config.getRows(), config.getCols());
					generation.make(config.getRows(), config.getCols());
					action.show();
				},
				onStartClick = function () {
					running = true;
					runGenerations();
				},
				onStopClick = function () {
					running = false;
				},
				onResetClick = function() {
					running - false;
					generation.make(config.getRows(), config.getCols());
				};
				configListeners = {
					useClick: onUseClick
				},
				actionListeners = {
					startClick: onStartClick,
					stopClick: onStopClick,
					resetClick: onResetClick
				};

			config.init(configListeners);
			action.init(actionListeners);
		};

	return {
		run: _run
	};
})();

Gol.run(WorldConfiguration, ActionPanel);