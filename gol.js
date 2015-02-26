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
		_init = function () {
			startBtn = document.getElementById(startBtnId);
			stopBtn = document.getElementById(stopBtnId);
			resetBtn = document.getElementById(resetBtnId);

			startBtn.style.display = 'none';
			stopBtn.style.display = 'none';
			resetBtn.style.display = 'none';
		};
	return {
		init: _init
	};
})();

var World = (function () {
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
				return cell;
			},
			renderRow = function (row, col) {
				var rowEl = document.createElement('tr');
				rowEl.setAttribute('id', constructRowId(row));
				for (var i = 1; i <= col; i++) {
					rowEl.appendChild(renderCell(row, i));
				}
				return rowEl;
			};

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

var Gol = (function (){
	var
		_run = function (config, action) {
			var
				onUseClick = function () {
					var world = new World();
					config.loadCounts();
					world.renderWorld(config.getRows(), config.getCols());
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