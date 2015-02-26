var WorldConfiguration = (function (){
	var
		num_rows = null,
		num_cols = null,
		default_rows = 10,
		default_cols = 10,
		rowId = 'rows',
		colId = 'columns',
		useBtnId = 'use-config',
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
			document.getElementById(useBtnId).onclick = listeners.useClick;
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

		this.renderWorld = function (rows, cols) {
			var
				table = document.createElement('table'),
				worldHolder = document.getElementById(renderContainerId);

			while (worldHolder.firstChild) {
				worldHolder.removeChild(worldHolder.firstChild);
			}

			for (var i = 1; i <= rows; i++) {
				table.appendChild(renderRow(i, cols));
			}

			table.style.padding = '5px';
			table.style.border = 'solid 1px';

			worldHolder.appendChild(table);
			
		};

		return this;
	};
})();

var Gol = (function (){
	var
		_run = function (config, worldContainer) {
			var
				onUseClick = function () {
					var world = new World();
					config.loadCounts();
					world.renderWorld(config.getRows(), config.getCols());
				},
				listeners = {
					useClick: onUseClick
				};

			config.init(listeners);
		};

	return {
		run: _run
	};
})();

Gol.run(WorldConfiguration);