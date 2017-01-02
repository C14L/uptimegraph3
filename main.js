Date.prototype.getISOWeek = function() {
  return moment(this).isoWeek();
}
Date.prototype.getISOWeekYear = function() {
  return moment(this).isoWeekYear();
}

$(document).ready(function(){
  var startYear = 2016,
      startWeek = 1;
  var now = new Date();
  var week = now.getISOWeek();
  var year = now.getISOWeekYear();
  var period = year + '-' + ('0' + week).slice(-2);
  // selected week/year. TODO: use to set vals as URL #hash
  var selWeek = week; // for now, use today's values.
  var selYear = year; 
  var oWeekSelect = $('#week-select');
  oWeekSelect.html('');

  for( y = startYear; y <= year; y++ ) {
    for( w = startWeek; ( ( y < year && w <= 52 ) || w <= week ); w++ ) {
      var sel = ( selYear == y && selWeek == w )?' selected="selected" ':'';
      var val = y+'-'+('0' + w).slice(-2);
      var s = '<option '+sel+' value="'+val+'">'+y+', W'+w+'</option>';
      oWeekSelect.append(s);
    }
  }

  show_period(oWeekSelect.val());
  $('#week-select').on('change', function(ev){
    show_period(this.value);
  });
});

function get_max_days( period ) {
    //var mon = parseInt(period.split("-")[1]);
    //return [null, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][mon];
    return 7;
}

function show_period( period ) {
  var data_url = 'data/' + period + '.txt';
  var placeholder = $('#chart');

  var mpstat_data_url = 'data/mpstat-all-' + period + '.txt';
  var mpstat_placeholder = $('#mpstatChart');

  var mailq_data_url = 'data/mailq-' + period + '.txt';
  var mailq_placeholder = $('#mailqChart');

  var mailsent_data_url = 'data/mailsent-' + period + '.txt';
  var mailsent_placeholder = $('#mailSent');

  var mailrecv_data_url = 'data/mailrecv-' + period + '.txt';
  var mailrecv_placeholder = $('#mailRecv');

  var mem_data_url = 'data/mem-' + period + '.txt';
  var mem_placeholder = $('#memChart');



  // Uptime server load //////////////////////////////////////////////////////

  $.get(data_url, {}, function(response) {
    var lines = response.split(/\n/);

    var data = [{label:  '1 min', data: []},
                {label:  '5 min', data: []},
                {label: '15 min', data: []}];

    for ( var i=0; i<lines.length; i++ ) {
      var item = lines[i].split(/\s/);
      var timestamp = (1000 * parseInt(item[0], 10)) || null;
      data[0].data.push( [ timestamp, parseInt( item[1] * 100 ) ] );
      data[1].data.push( [ timestamp, parseInt( item[2] * 100 ) ] );
      data[2].data.push( [ timestamp, parseInt( item[3] * 100 ) ] );
    }

    var p_min = new Date(period + "-01T00:00").getTime(),
        p_max = new Date(period + "-" + get_max_days(period) + "T23:59").getTime();

    var options = {
      xaxis: {
        mode: "time",
        timeformat: "%Y-%m-%d %H:%M",
        //min: p_min,
        //max: p_max,
      },
      yaxis: {
      },
      selection: {
        mode: "x"
      },
    };

    placeholder.bind("plotselected", function (event, ranges) {
      $.each(plot.getXAxes(), function(_, axis) {
        var opts = axis.options;
        opts.min = ranges.xaxis.from;
        opts.max = ranges.xaxis.to;
      });
      plot.setupGrid();
      plot.draw();
      plot.clearSelection();
    });

    placeholder.bind("plotunselected", function (event) {
    });

    $("#clearSelection").click(function () {
      $.each(plot.getXAxes(), function(_, axis) {
        var opts = axis.options;
        opts.min = null;
        opts.max = null;
      });
      plot.setupGrid();
      plot.draw();
      plot.clearSelection();
    });

    var plot = $.plot(placeholder, data, options);
  })
  .fail(function( jqXHR, textStatus, errorThrown ) {
    placeholder.html('<div class="notfound">Not found.</div>');
  });



  // mpstat ALL //////////////////////////////////////////////////////
  //   0      1       2       3     4         5      6      7       8       9       10
  // time   %usr   %nice    %sys %iowait    %irq   %soft  %steal  %guest  %gnice   %idle

  $.get(mpstat_data_url, {}, function(response) {
    var lines = response.split(/\n/);

    var data = [{label: '%usr', data: []},
                {label: '%sys', data: []},
                {label: '%iowait', data: []},
                {label: '%idle', data: []},
            ];

    for ( var i=0; i<lines.length; i++ ) {
      var item = lines[i].split(/\s+/);
      var timestamp = (1000 * parseInt(item[0], 10)) || null;
      data[0].data.push( [ timestamp, parseInt( item[1] ) ] ); // %usr
      data[1].data.push( [ timestamp, parseInt( item[3] ) ] ); // %sys
      data[2].data.push( [ timestamp, parseInt( item[3] ) ] ); // %iowait
      data[3].data.push( [ timestamp, parseInt( item[10]) ] ); // %idle
    }

    var p_min = new Date(period + "-01T00:00").getTime(),
        p_max = new Date(period + "-" + get_max_days(period) + "T23:59").getTime();

    var options = {
      xaxis: {
        mode: "time",
        timeformat: "%Y-%m-%d %H:%M",
        //min: p_min,
        //max: p_max,
      },
      yaxis: {
          min: 0,
          max: 100,
      },
      selection: {
        mode: "x"
      },
    };

    mpstat_placeholder.bind("plotselected", function (event, ranges) {
      $.each(plot.getXAxes(), function(_, axis) {
        var opts = axis.options;
        opts.min = ranges.xaxis.from;
        opts.max = ranges.xaxis.to;
      });
      plot.setupGrid();
      plot.draw();
      plot.clearSelection();
    });

    mpstat_placeholder.bind("plotunselected", function (event) {
    });

    $("#clearSelection").click(function () {
      $.each(plot.getXAxes(), function(_, axis) {
        var opts = axis.options;
        opts.min = null;
        opts.max = null;
      });
      plot.setupGrid();
      plot.draw();
      plot.clearSelection();
    });

    var plot = $.plot(mpstat_placeholder, data, options);
  })
  .fail(function( jqXHR, textStatus, errorThrown ) {
    mpstat_placeholder.html('<div class="notfound">Not found.</div>');
  });



  // mailq graph ////////////////////////////////////////////////////////

  $.get(mailq_data_url, {}, function(response) {
    var lines = response.split(/\n/);

    var data = [{label:  'mail queue', data: []}, ];

    for ( var i=0; i<lines.length; i++ ) {
      var item = lines[i].split(/\s/);
      var timestamp = (1000 * parseInt(item[0], 10)) || null;
      data[0].data.push( [ timestamp, parseInt( item[1] * 1 ) ] );
    }

    var p_min = new Date(period + "-01T00:00").getTime(),
        p_max = new Date(period + "-" + get_max_days(period) + "T23:59").getTime();

    var options = {
      xaxis: {
        mode: "time",
        timeformat: "%Y-%m-%d %H:%M",
        //min: p_min,
        //max: p_max,
      },
      yaxis: {
        min: 0,
        //max: p_max,
      },
      selection: {
        mode: "x"
      },
    };

    mailq_placeholder.bind("plotselected", function (event, ranges) {
      $.each(plot.getXAxes(), function(_, axis) {
        var opts = axis.options;
        opts.min = ranges.xaxis.from;
        opts.max = ranges.xaxis.to;
      });
      plot.setupGrid();
      plot.draw();
      plot.clearSelection();
    });

    mailq_placeholder.bind("plotunselected", function (event) {
    });

    $("#clearSelection").click(function () {
      $.each(plot.getXAxes(), function(_, axis) {
        var opts = axis.options;
        opts.min = null;
        opts.max = null;
      });
      plot.setupGrid();
      plot.draw();
      plot.clearSelection();
    });

    var plot = $.plot(mailq_placeholder, data, options);
  })
  .fail(function( jqXHR, textStatus, errorThrown ) {
    mailq_placeholder.html('<div class="notfound">Not found.</div>');
  });



  // mailsent graph ////////////////////////////////////////////////////////

  $.get(mailsent_data_url, {}, function(response) {
    var lines = response.split(/\n/);

    var data = [{label:  'mails sent', data: []}, ];

    for ( var i=0; i<lines.length; i++ ) {
      var item = lines[i].split(/\s/);
      var timestamp = (1000 * parseInt(item[0], 10)) || null;
      data[0].data.push( [ timestamp, parseInt( item[1] * 1 ) ] );
    }

    var p_min = new Date(period + "-01T00:00").getTime(),
        p_max = new Date(period + "-" + get_max_days(period) + "T23:59").getTime();

    var options = {
      xaxis: {
        mode: "time",
        timeformat: "%Y-%m-%d %H:%M",
        //min: p_min,
        //max: p_max,
      },
      yaxis: {
        min: 0,
        //max: p_max,
      },
      selection: {
        mode: "x"
      },
    };

    mailsent_placeholder.bind("plotselected", function (event, ranges) {
      $.each(plot.getXAxes(), function(_, axis) {
        var opts = axis.options;
        opts.min = ranges.xaxis.from;
        opts.max = ranges.xaxis.to;
      });
      plot.setupGrid();
      plot.draw();
      plot.clearSelection();
    });

    mailsent_placeholder.bind("plotunselected", function (event) {
    });

    $("#clearSelection").click(function () {
      $.each(plot.getXAxes(), function(_, axis) {
        var opts = axis.options;
        opts.min = null;
        opts.max = null;
      });
      plot.setupGrid();
      plot.draw();
      plot.clearSelection();
    });

    var plot = $.plot(mailsent_placeholder, data, options);
  })
  .fail(function( jqXHR, textStatus, errorThrown ) {
    mailsent_placeholder.html('<div class="notfound">Not found.</div>');
  });




  // mailsent graph ////////////////////////////////////////////////////////

  $.get(mailrecv_data_url, {}, function(response) {
    var lines = response.split(/\n/);

    var data = [{label:  'mails received', data: []}, ];

    for ( var i=0; i<lines.length; i++ ) {
      var item = lines[i].split(/\s/);
      var timestamp = (1000 * parseInt(item[0], 10)) || null;
      data[0].data.push( [ timestamp, parseInt( item[1] * 1 ) ] );
    }

    var p_min = new Date(period + "-01T00:00").getTime(),
        p_max = new Date(period + "-" + get_max_days(period) + "T23:59").getTime();

    var options = {
      xaxis: {
        mode: "time",
        timeformat: "%Y-%m-%d %H:%M",
        //min: p_min,
        //max: p_max,
      },
      yaxis: {
        min: 0,
        //max: p_max,
      },
      selection: {
        mode: "x"
      },
    };

    mailrecv_placeholder.bind("plotselected", function (event, ranges) {
      $.each(plot.getXAxes(), function(_, axis) {
        var opts = axis.options;
        opts.min = ranges.xaxis.from;
        opts.max = ranges.xaxis.to;
      });
      plot.setupGrid();
      plot.draw();
      plot.clearSelection();
    });

    mailrecv_placeholder.bind("plotunselected", function (event) {
    });

    $("#clearSelection").click(function () {
      $.each(plot.getXAxes(), function(_, axis) {
        var opts = axis.options;
        opts.min = null;
        opts.max = null;
      });
      plot.setupGrid();
      plot.draw();
      plot.clearSelection();
    });

    var plot = $.plot(mailrecv_placeholder, data, options);
  })
  .fail(function( jqXHR, textStatus, errorThrown ) {
    mailrecv_placeholder.html('<div class="notfound">Not found.</div>');
  });



  // mem graph (8192 1899 6292) /////////////////////////////////////////////

  $.get(mem_data_url, {}, function(response) {
    var lines = response.split(/\n/);

    var data = [{label: 'memory', data: []},
                {label: 'used', data: []},
                {label: 'free', data: []}];

    for ( var i=0; i<lines.length; i++ ) {
      var item = lines[i].split(/\s/);
      var timestamp = (1000 * parseInt(item[0], 10)) || null;
      data[0].data.push( [ timestamp, parseInt( item[1] * 1 ) ] );
      data[1].data.push( [ timestamp, parseInt( item[2] * 1 ) ] );
      data[2].data.push( [ timestamp, parseInt( item[3] * 1 ) ] );
    }

    var p_min = new Date(period + "-01T00:00").getTime(),
        p_max = new Date(period + "-" + get_max_days(period) + "T23:59").getTime();

    var options = {
      xaxis: {
        mode: "time",
        timeformat: "%Y-%m-%d %H:%M",
        //min: p_min,
        //max: p_max,
      },
      yaxis: {
        min: 0,
        //max: p_max,
      },
      selection: {
        mode: "x"
      },
    };

    mem_placeholder.bind("plotselected", function (event, ranges) {
      $.each(plot.getXAxes(), function(_, axis) {
        var opts = axis.options;
        opts.min = ranges.xaxis.from;
        opts.max = ranges.xaxis.to;
      });
      plot.setupGrid();
      plot.draw();
      plot.clearSelection();
    });

    mem_placeholder.bind("plotunselected", function (event) {
    });

    $("#clearSelection").click(function () {
      $.each(plot.getXAxes(), function(_, axis) {
        var opts = axis.options;
        opts.min = null;
        opts.max = null;
      });
      plot.setupGrid();
      plot.draw();
      plot.clearSelection();
    });

    var plot = $.plot(mem_placeholder, data, options);
  })
  .fail(function( jqXHR, textStatus, errorThrown ) {
    mem_placeholder.html('<div class="notfound">Not found.</div>');
  });

}
