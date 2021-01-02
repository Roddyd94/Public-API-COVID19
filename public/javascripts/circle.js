const CIRCLE_RADIUS = [

];

var circles = {};
var circlesText = {};

var dateRangeBar = document.getElementById('date-range');

function mouseEventer(circle, key, types)
{
    kakao.maps.event.addListener(circle, 'mouseover', function(mouseEvent){
        //circle.setOptions({fillColor: '#ff0000'});
        var content = '<div class="info">' + '<div class="title">' + key + '</div>';
        types.forEach((vType, iType) => {
            content += `<div class="${vType}">${TYPE_DICT_REV[vType]} : ${result[dateRangeBar.value][key][vType]}</div>`;
        });
        content += '</div>';
        infowindow.setContent(content);
        infowindow.setPosition(circle.getPosition());
        infowindow.setMap(map);
    });
    kakao.maps.event.addListener(circle, 'mouseout', function(mouseEvent){
        infowindow.setMap(null);
    });
    kakao.maps.event.addListener(circle, 'click', function(mouseEvent)
    {

    });
}

const LOCATION_POS = {
    '합계': [33.95539147515894, 128.0274362874066],
    '검역': [37.38383833272835, 126.11542242116155],
    '서울': [37.566878329376706, 126.97902577251755],
    '경기': [37.41774814762161, 127.45153447005788],
    '인천': [37.3990656204701, 126.65092119319011],
    '강원': [37.7707830678678, 128.29082789733633],
    '충남': [36.197674019130154, 126.90396733739227],
    '대전': [36.37707530326025, 127.37447887789493],
    '충북': [36.836027175807, 127.84735590484483],
    '세종': [36.608097455055756, 127.24969124826109],
    '부산': [35.196787710466, 129.08919137170977],
    '울산': [35.56201421451208, 129.30189270505852],
    '대구': [35.87786591381128, 128.60240334335745],
    '경북': [36.4223568213318, 128.59639543377364],
    '경남': [35.52894471919139, 128.46561076069227],
    '전남': [34.8732477703635, 126.88593302064082],
    '광주': [35.177830230568695, 126.87426756056897],
    '전북': [35.75907346416132, 127.25833386343932],
    '제주': [33.3810465674356, 126.53907495907768]
}


var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
mapOption = { 
    center: new kakao.maps.LatLng(35.87777664201958, 127.61024450024775), // 지도의 중심좌표
    level: 13 // 지도의 확대 레벨
};

var map = new kakao.maps.Map(mapContainer, mapOption);

kakao.maps.event.addListener(map, 'zoom_changed', function() {        
    var level = map.getLevel();
    circleArr = Object.getOwnPropertyNames(circles);
    circleArr.forEach((v, i) => {
        circles[v].setRadius((2 ** level) * 2.5);
    });
});
//map.setDraggable(false);
var infowindow = new kakao.maps.InfoWindow({
    removable: true,
    zIndex: 102
});

var drawOnMap = (result) => {
    var tempGubun = Object.getOwnPropertyNames(circles);
    tempGubun.forEach((v, i) => {
        circles[v].setMap(null);
        circlesText[v].setMap(null);
    });

    circles = {};
    circlesText = {};

    var gubuns = Object.getOwnPropertyNames(result[0]);
    var types = Object.getOwnPropertyNames(result[0][gubuns[1]]);
    
    dateRangeBar.max = result['dates'] - 1;

    document.getElementById('date-range-label').innerHTML = result[0]['stdDay'];
    dateRangeBar.oninput = () => {
        document.getElementById('date-range-label').innerHTML = result[dateRangeBar.value]['stdDay'];
    };
    
    gubuns.forEach((v, i) => {
        if (i != 0)
        {
            circlesText[v] = new kakao.maps.CustomOverlay({
                position: new kakao.maps.LatLng(LOCATION_POS[v][0], LOCATION_POS[v][1]),
                content: '<div class="label">' + v + '</div>',
                zIndex: 100
            });
            
            circles[v] = new kakao.maps.Circle({
                center: new kakao.maps.LatLng(LOCATION_POS[v][0], LOCATION_POS[v][1]),
                radius: (2 ** map.getLevel()) * 2,
                strokeWeight: 0,
                fillColor: '#007d00',
                fillOpacity: 0.6,
                zIndex: 101
            });

            circlesText[v].setMap(map);
            circles[v].setMap(map);
            mouseEventer(circles[v], v, types);
            circlesText[v].a.onmouseover = () => {
                var content = '<div class="info">' + '<div class="title">' + v + '</div>';
                types.forEach((vType, iType) => {
                    content += `<div class="${vType}">${TYPE_DICT_REV[vType]} : ${result[dateRangeBar.value][v][vType]}</div>`;
                });
                content += '</div>';
                infowindow.setContent(content);
                infowindow.setPosition(circles[v].getPosition());
                infowindow.setMap(map);
            };
            circlesText[v].a.onmouseout = () => {
                infowindow.setMap(null);
            };
        }
    });
};
