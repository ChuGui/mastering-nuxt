export default function(context, inject) {
    let isLoaded = false
    let waiting = []

    addScript()
    inject('maps', {
        showMap,
        makeAutoComplete
    })

    function addScript(){
        const script = document.createElement('script')
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBvVHRt3FGj5y7gQbEd-ZVoDomO40C__I8&libraries=places&callback=initGoogleMap"
        script.async = true
        window.initGoogleMap = initGoogleMap
        document.head.appendChild(script)
    }

    function initGoogleMap() {
        isLoaded = true
        waiting.forEach((item) => {
            if(typeof item.fn === 'function'){
                item.fn(...item.arguments)
            }
        })
        waiting = []
    }

    function makeAutoComplete(input){
        if(!isLoaded){
            waiting.push({
                fn: makeAutoComplete,
                arguments
            })
            return
        }

        const autoComplete = new window.google.maps.places.Autocomplete(input, {
            types: ['(cities)']
        })

        autoComplete.addListener('place_changed', () => {
            const place = autoComplete.getPlace()
            input.dispatchEvent(new CustomEvent('changed', { detail: place }))
        })
    }

    function showMap(canvas, lat, lng, markers){
        if(!isLoaded){
            waiting.push({
                fn: showMap,
                arguments,
            })
            return
        }

        const mapOptions = {
            zoom: 18,
            center: new window.google.maps.LatLng(lat, lng),
            disableDefaultUI: true,
            zoomControl: true
        }
        const map = new window.google.maps.Map(canvas, mapOptions)
        if(!markers){
            const position = new window.google.maps.LatLng(lat, lng)
            const marker = new window.google.maps.Marker({ position })
            marker.setMap(map)
            return
        }

        const bounds = new window.google.maps.LatLngBounds()
        markers.forEach( home => {
            const position = new window.google.maps.LatLng(home.lat, home.lng)
            const marker = new window.google.maps.Marker({
                position,
                label: {
                    text: `$${home.pricePerNight}`
                }
            })
            marker.setMap(map)
            bounds.extend(position)
        })

        map.fitBounds(bounds)
    }
}
