var mapInstance;

var map = {
  init: function(mainPoint){
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
    new google.maps.Marker({
      position: {
        lat: +mainPoint.lat,
        lng: +mainPoint.long
      },
      icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      map: mapInstance
    });
  },
  createMarker: function(el){
    return new google.maps.Marker({
      position: {
        lat: +el.lat,
        lng: +el.long
      },
      icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      map: mapInstance
    });
  }
}

var dropdown = {
  standardTemplate: function(name){
    return '<div>' +
      '<div class="bw-button__opener"></div>' +
      '</div><div class="dropdown dropdown-' + name + ' closed">' +
      '<div class="title">Distance (minutes)</div>' +
      '<div class="dropdown-menu dropdown-menu-' + name + '">' +
      '<ul>' +
      '<li><5 minutes</li>' +
      '<li><10 minutes</li>' +
      '<li><15 minutes</li>' +
      '<li><30 minutes</li>' +
      '<li><45 minutes</li>' +
      '</ul>' +
      '</div>' +
      '</div>';
  },
  init: function(name){
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

    $(".dropdown-menu" + name + " li").click(function () {
      e.stopPropagation();
      closeMenu(this);
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
  show: function(){
    document.getElementById("bw-preloader-layer").className = "visible"
  },
  hide: function(){
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
    button.init("foot")
    button.init("car")
    button.init("bike")
    button.init("public", "custom")
    tooltip.init()
  },
  getData: function(){
    $.ajax({
      type: "POST",
      url: "https://still-hollows-33347.herokuapp.com/api/get_suitable_hotels/",
      data: {
        "destination":"Barbican centre",
        "checkin":"2017-10-22",
        "checkout":"2017-10-23",
        "room1":'"A","A",4',
        "type":"walking",
      },
      success: function (res) {
        var mainPoint =  res.origin;
        map.init(mainPoint);
        customGUI.showDataOnMap(res.suitable_hotels)
      }
    });
  },
  showDataOnMap: function(hotels){
    hotels.forEach(function (el) {
      map.createMarker(el)
    })
    preloader.hide()
  }
}

customGUI.init();
customGUI.getData();

