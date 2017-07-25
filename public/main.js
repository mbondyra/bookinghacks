var CENTER_POINT = {lat: 52.3588347328288, lng: 4.89386737346649};

var map = {
  init: function(){
    var map = new google.maps.Map(document.getElementById('bw-map'), {
      zoom: 11,
      center: CENTER_POINT,
      streetViewControl: false,
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER
      }
    });
  },
  createMarker: function(el){
    return new google.maps.Marker({
      position: {
        lat: el.latitude,
        lng: el.longitude
      },
      icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      map: map
    });
  }
}

var dropdown = {
  template: function(name){
    return '<div class="dropdown dropdown-' + name + ' closed">' +
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

    $(".dropdown-" + name + " .title").click(function () {
      if ($container.height() > 0) {
        closeMenu(this);
      } else {
        openMenu(this);
      }
    });

    $(".dropdown-menu" + name + " li").click(function () {
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
    button.innerHTML = dropdown.template(name);
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

var customGUI = {
  init: function () {
    var toolkit = document.createElement('div');
    toolkit.setAttribute('id', 'bw-toolkit');
    document.getElementById('bw-container').appendChild(toolkit);
    button.init("foot")
    button.init("car")
    button.init("bike")
    button.init("public")
    tooltip.init()
    preloader.init();
  },
  getData: function(){
    $.ajax({
      type: "POST",
      url: "https://still-hollows-33347.herokuapp.com/api/get_hotels_by_city_id/",
      data: {

        "checkin":"2017-10-22",
        "checkout":"2017-10-23",
        "room1":'"A","A",4',
        "destination":"Barbican centre"
      },
      success: function (res) {
        customGUI.showDataOnMap(res.hotels)
      }
    });
  },
  showDataOnMap: function(hotels){
    hotels.forEach(function (el) {
      var marker = map.createMarker(el)
    })
    preloader.hide()
  }
}

map.init();
customGUI.init();

