mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: trainer.geometry.coordinates,
    zoom: 10
});

new mapboxgl.Marker()
    .setLngLat(trainer.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3>${trainer.firstName} ${trainer.lastName}</h3>`)
    )
    .addTo(map)