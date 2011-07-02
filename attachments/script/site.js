var app = {
	baseURL: util.getBaseURL(document.location.pathname),
	container: 'main_content'
};

app.handler = function(route) {
  if (route.params && route.params.route) {
    var path = route.params.route;
    app.routes[path](route.params.id);
  } else {
    app.routes['home']();
  }  
};

app.routes = {
  home: function() {
    removalist.bootstrap();
    
    $( '.csv' ).live('click', ( function( e ) {      
      window.location.href = app.csvUrl;
      e.preventDefault();
    }))
    
    $( '.transform' ).live('click', ( function( e ) {      
      $('.dialog-overlay').show();
      $('.dialog-container').show();
      util.render('bulkEdit', 'dialog-content');
      $('.cancelButton').click(function(e) {
        $('.dialog-overlay').hide();
        $('.dialog-container').hide();
      })
      $('.menu').hide();
      $('.menu-overlay').hide();
      e.preventDefault();
    }))
  },
  page: function(id) {
    removalist.getPageSize();
  }
}

app.after = {
  tableContainer: function() {
    removalist.activateControls();
  },
  dataTable: function() {
    $('.column-header-menu').click(function(e) {
      var offset = $(e.target).offset();
      $('.menu-overlay').show().click(function(e) {
        $(e.target).hide();
        $('.menu').hide();
      });
      $('.menu').show().css({top: offset.top + 20, left: offset.left});
    })
  }
}

app.sammy = $.sammy(function () {
  this.get('', app.handler);
  this.get("#/", app.handler);
  this.get("#:route", app.handler);
  this.get("#:route/:id", app.handler);
});

$(function() {
  app.sammy.run();  
})