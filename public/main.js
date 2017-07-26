var mapInstance;
var markers = [];

var initialData = {
  "destination": destination,
  "checkin": checkin,
  "checkout": checkout,
  "room1": 'A,A,4',
  "type": "walking",
  "time": 3600
}
var data = {
  "destination": destination,
  "checkin": checkin,
  "checkout": checkout,
  "room1": 'A,A,4',
  "type": "walking",
  "time": 3600
}



var map = {
  init: function (mainPoint) {
    mapInstance = new google.maps.Map(document.getElementById('bw-map'), {
      zoom: 14,
      center: {
        lat: +mainPoint.lat,
        lng: +mainPoint.long
      },
      streetViewControl: false,
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER
      }
    });
    var destPoint = new google.maps.Marker({
      position: {
        lat: +mainPoint.lat,
        lng: +mainPoint.long
      },
      icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      map: mapInstance
    });

    var content = "Destination: "+initialData.destination;
    var infowindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(destPoint, 'click', function() {
      infowindow.open(mapInstance,destPoint);
    });
  },
  setMapOnAll: function (dest) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(dest);
    }
  },
  deleteMarkers: function () {
    map.setMapOnAll(null);
    markers = [];
  },
  addMarker: function (el) {
    var marker = new google.maps.Marker({
      position: {
        lat: +el.lat,
        lng: +el.long
      },
      icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      map: mapInstance
    });
    markers.push(marker);

    var content = "<div>"+el.name+"</div>" +
      "<div>"+el.price+" "+el.currency_code+"</div>"+
      "<div><a>more...</a></div>";
    var infowindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(mapInstance, marker);
    });
  }
}


var dropdown = {
  standardTemplate: function (name) {
    return '<div>' +
      '<div class="bw-button__opener"></div>' +
      '</div><div class="dropdown dropdown-' + name + ' closed">' +
      '<div class="title">Distance (minutes)</div>' +
      '<div class="dropdown-menu dropdown-menu-' + name + '">' +
      '<ul>' +
      '<li data-time="300"><5 minutes</li>' +
      '<li data-time="600"><10 minutes</li>' +
      '<li data-time="900"><15 minutes</li>' +
      '<li data-time="1800"><30 minutes</li>' +
      '<li data-time="2700"><45 minutes</li>' +
      '</ul>' +
      '</div>' +
      '</div>';
  },
  init: function (name) {
    var $container = $('.dropdown-menu-' + name),
      $list = $('.dropdown-menu-' + name + ' ul'),
      listItem = $list.find('li');

    $(".dropdown-" + name + " .title").click(function (e) {
      e.stopPropagation();
      if ($container.height() > 0) {
        closeMenu(this);
      } else {
        openMenu(this);
      }
    });

    $(".dropdown-" + name + " li").click(function (e) {
      e.stopPropagation();
      closeMenu(this);
      data.time = $(this).attr('data-time');
      data.type = name;
      customGUI.getDataAfterClick()
    });

    function closeMenu(el) {
      $(el).closest('.dropdown-' + name).toggleClass("closed").find(".title").text($(el).text());
      $container.css("height", 0);
      $list.css("top", 0);
    }

    function openMenu(el) {
      $(el).parent().toggleClass("closed");

      $container.css({
        height: 200
      })
    }
  }
}

var button = {
  init: function (name) {
    var button = document.createElement('div');
    button.setAttribute('id', name);
    button.setAttribute('class', 'bw-button');
    button.innerHTML = dropdown.standardTemplate(name);
    document.getElementById('bw-toolkit').appendChild(button);
    dropdown.init(name);
    $('#' + name).click(function (el) {
      $(this).toggleClass("bw-button--open");
    })
  }
}

var tooltip = {
  init: function () {
    var tooltip = document.createElement('div');
    tooltip.innerText = "New Filter - Try it out!";
    tooltip.setAttribute('id', "bw-tooltip");
    document.getElementById('bw-toolkit').appendChild(tooltip);

    tooltip.addEventListener('click', function () {
      this.remove();
    })
  }
}

var preloader = {
  init: function () {
    var preloader = document.createElement('div');
    preloader.setAttribute('id', "bw-preloader-layer");
    preloader.innerHTML = '<div id="DIV_1">' +
      '<div id="DIV_2">' +
      ' </div>' +
      ' <h3 id="H3_3">' +
      ' Applying filters' +
      ' </h3>' +
      ' <div id="DIV_4">' +
      '  You will see your results on the map' +
      '</div>' +
      ' </div>'
    document.getElementsByTagName('body')[0].appendChild(preloader);
  },
  show: function () {
    document.getElementById("bw-preloader-layer").className = "visible"
  },
  hide: function () {
    document.getElementById("bw-preloader-layer").className = ""
  }
}

preloader.init();
preloader.show();

var customGUI = {
  init: function () {
    var toolkit = document.createElement('div');
    toolkit.setAttribute('id', 'bw-toolkit');
    document.getElementById('bw-container').appendChild(toolkit);
    button.init("walking")
    button.init("driving")
    button.init("cycling")
    button.init("public_transport", "custom")
    tooltip.init()
    customGUI.getInitialData()
  },
  getInitialData: function () {
    customGUI.getData(initialData, function (res) {
      var mainPoint = res.origin;
      map.init(mainPoint);
      customGUI.showDataOnMap(res.suitable_hotels)
      preloader.hide()
    })
  },
  getDataAfterClick: function(){
    preloader.show();
    customGUI.getData(data, function (res) {
      map.deleteMarkers();
      customGUI.showDataOnMap(res.suitable_hotels)
      preloader.hide()
    })
  },
  getData: function (data, success) {
    $.ajax({
      type: "POST",
      url: "https://still-hollows-33347.herokuapp.com/api/get_suitable_hotels/",
      data: data,
      success: success
    });
  },
  showDataOnMap: function (hotels) {
    hotels.forEach(function (el) {
      map.addMarker(el)
    })
    map.setMapOnAll(mapInstance)
  }
}


customGUI.init();

