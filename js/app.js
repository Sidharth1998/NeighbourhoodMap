var map;
var infoWindow;
var clientId;
var clientSecret;
var streetViewService;
var markers = [];
var locations = [{
    title: 'Salar Jung Museum',
    lat: 17.3715,
    lng: 78.4803
}, {
    title: 'Charminar',
    lat: 17.3616,
    lng: 78.4747
}, {
    title: 'Gautam Buddha Statue',
    lat: 17.4156,
    lng: 78.4750
}, {
    title: 'Chowmahalla Palace',
    lat: 17.3578,
    lng: 78.4714
}, {
    title: 'Golconda Fort',
    lat: 17.3833,
    lng: 78.4011
}, {
    title: 'Birla Mandir',
    lat: 17.4062,
    lng: 78.4691
}, {
    title: 'Gvk One',
    lat: 17.4194,
    lng: 78.4487
}, {
    title: 'Nehru Zoological Park',
    lat: 17.3511,
    lng: 78.4489
}];

var Location = function(data) {
    var self = this;
    this.title = data.title;
    this.lat = data.lat;
    this.lng = data.lng;
    this.area = "";
    this.visible = ko.observable(true);
    this.marker = data.marker;

    var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' +
        this.lat + ',' + this.lng + '&client_id=' + clientId + '&client_secret=' +
        clientSecret + '&v=20170915' + '&query=' + this.title;

    $.get(foursquareURL).done(function(data) {
        $.each(data.response.venues[0], function() {
            self.area = data.response.venues[0].location.address;
        })
    }).fail(function() {
        alert("Failed to load because of: " + error.status);
    });

    this.information = '<div class="info"><div class="title"><b>' + data.title + "</b></div>" +
        '<div class="street">' + self.area + '</div>' +
        '<div class="city">Hyderabad</div></div>';

    this.infoWindow = new google.maps.InfoWindow({
        content: self.info
    });

    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.lng),
        map: map,
        title: data.title,
        animation: google.maps.Animation.DROP
    });

    this.marker.addListener('click', function() {
        self.info = '<div class="info"><div class="title"><b>' + data.title + "</b></div>" +
            '<div class="street">' + self.area + '</div>' +
            '<div class="city">Hyderabad</div></div>';

        self.infoWindow.setContent(self.info);

        self.infoWindow.open(map, this);

        self.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            self.marker.setAnimation(null);
        }, 700);
    });

    this.click = function() {
        self.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            self.marker.setAnimation(null);
        }, 1400);
    };
};

function MyViewModel() {
    var self = this;

    this.input = ko.observable("");

    this.list = ko.observableArray([]);

    clientId = "D2JBOCZ42OYY2PY3Z2FSU4WC32JFUSIQZAN35QV1HBYXGWRQ";
    clientSecret = "A31FSH1CAOIRL32IE21PRCPCXXNKGP2XHBRMGWFCF5OSYQM5";

    locations.forEach(function(location) {
        self.list.push(new Location(location));
    });

    self.filteredList = ko.computed(function() {
        return ko.utils.arrayFilter(self.list(), function(place) {
            if (self.input().length == 'undefined' || place.title.toLowerCase().indexOf(self.input().toLowerCase()) >= 0) {
                place.marker.setVisible(true);
                return true;
            } else {
                place.marker.setVisible(false);
                return false;
            }
        });
    })

}

function myApp() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {
            lat: 17.3850,
            lng: 78.4867
        }
    });
    ko.applyBindings(new MyViewModel());
}

function errorHandling() {
    alert("Google Maps has failed to load. Please check your internet connection or try reloading the page.");
}