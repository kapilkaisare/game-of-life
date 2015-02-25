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
		_init = function () {
			document.getElementById(useBtnId).onclick = _loadCounts;
		};

	return {
		readRowCount: _readRowCount,
		readColCount: _readColCount,
		getRows: _getRows,
		getCols: _getCols,
		init: _init
	};
})();

var Gol = (function (){
	var
		_run = function (config, worldContainer) {
			config.init();
		};

	return {
		run: _run
	};
})();

Gol.run(WorldConfiguration);