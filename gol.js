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
		_init = function () {
			startBtn = document.getElementById(startBtnId);
			stopBtn = document.getElementById(stopBtnId);
			resetBtn = document.getElementById(resetBtnId);

			this.hide();
		};
	return {
		init: _init,
		hide: _hide,
		show: _show
	};
})();

var World = (function (eventor) {
	return function () {
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
				for (var i = 1; i <= col; i++) {
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

			for (var i = 1; i <= rows; i++) {
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

	var events = {};

	this.registerEvent = function (eventName) {
		events[eventName] = {
			subscriptions: []
		}
	};

	this.subscribeEvent = function (eventName, func) {
		if (events[eventName]) {
			events[eventName].subscriptions.push(func);
		}
	};

	this.fireEvent = function (eventName) {
		if (events[eventName]) {
			for (var i = 0, n = events[eventName].subscriptions.length; i < n; i++) {
				events[eventName].subscriptions[i]();
			}
		}
	};

	this.clearSubscriptions = function (eventName) {
		if (events[eventName]) {
			events[eventName].subscriptions = [];
		}
	};

	return this;
})();

var Gol = (function (){
	var
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
				onUseClick = function () {
					var world = new World(eventBridge);
					config.loadCounts();
					world.renderWorld(config.getRows(), config.getCols());
					action.show();
				},
				configListeners = {
					useClick: onUseClick
				};

			config.init(configListeners);
			action.init();
		};

	return {
		run: _run
	};
})();

Gol.run(WorldConfiguration, ActionPanel);