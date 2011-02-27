/*globals SCTable*/

/*
  Defines an internal communication API for the TableView components.  Not meant to
  be used externally.
*/

SCTable.TableColumnsDelegate = {

  // PUBLIC PROPERTIES
  
  isTableColumnsDelegate: YES,
  
  // PUBLIC METHODS

  beginColumnResizeDrag: function() {
    //console.log('%@.beginResizeDrag()'.fmt(this));
  },
  
  updateColumnResizeDrag: function(evt, col, colIndex, newWidth) {
    //console.log('%@.updateResizeDrag()'.fmt(this));
  },

  endColumnResizeDrag: function() {
    //console.log('%@.endResizeDrag()'.fmt(this));
  },
  
  tableColumnDidRequestSort: function(col, colIndex, direction) {
    //console.log('%@.tableColumnDidRequestSort(col: %@, colIndex: %@, direction: %@)'.fmt(this, col, colIndex, direction));
  }

};
