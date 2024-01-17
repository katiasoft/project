const mapElement = document.getElementById('map');
if (mapElement !== null){
    mapElement.geocoder = new kakao.maps.services.Geocoder();
    let prevMarker = null;
    let prevInfowindow = null;

    function mapReset(){
        mapElement.init = (params) => {
            mapElement.object = new kakao.maps.Map(mapElement, {
                center: new kakao.maps.LatLng(params.latitude, params.longitude),
                draggable: false,
                level: params.level
            });
        };

        navigator.geolocation.getCurrentPosition(e => {
            mapElement.init({
                latitude: e.coords.latitude,
                longitude: e.coords.longitude,
                level: 3
            });
        }, () => {
            mapElement.init({
                latitude: 35.8715411,
                longitude: 128.601505,
                level: 3
            });
        });
    }

    mapReset();

    function mapAddressSearch(address){
        mapElement.geocoder.addressSearch(address, function(result, status) {
            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {
                if(prevMarker !== null)
                    prevMarker.setMap(null);

                if(prevInfowindow !== null)
                    prevInfowindow.setMap(null);

                let coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                // 결과값으로 받은 위치를 마커로 표시합니다
                let marker = new kakao.maps.Marker({
                    map: mapElement.object,
                    position: coords
                });

                // 인포윈도우로 장소에 대한 설명을 표시합니다
                let infowindow = new kakao.maps.InfoWindow({
                    content: '<div style="width:150px;text-align:center;padding:6px 0;">사업장 위치</div>'
                });
                infowindow.open(mapElement.object, marker);
                prevInfowindow = infowindow;
                prevMarker = marker;
                // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                mapElement.object.setCenter(coords);
                contents.newCampingForm['latitude'].value = result[0].y;
                contents.newCampingForm['longitude'].value = result[0].x;

                console.log(contents.newCampingForm['latitude'].value);
                console.log(contents.newCampingForm['longitude'].value);
            }
        });
    }

    function setDraggable(draggable) {
        // 마우스 드래그로 지도 이동 가능여부를 설정합니다
        mapElement.object.setDraggable(draggable);
    }
}
