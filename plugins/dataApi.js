export default function (context, inject) {
    const appId = 'KA83I0BOTF'
    const apiKey = '03c7d4d960f4cdde2b2db92a1446a248'
    const headers = {
        'X-Algolia-API-Key': apiKey,
        'X-Algolia-Application-Id': appId,
    }

    inject('dataApi', {
        getHome,
        getHomes,
        getReviewsByHomeId,
        getUserByHomeId,
        getHomeByLocation,
    })

    async function getHome(homeId) {
        try {
            return unWrap(await fetch(`https://${appId}-dsn.algolia.net/1/indexes/homes/${homeId}`, {headers}
            ))
        } catch (error) {
            return getErrorResponse(error)
        }
    }

    async function getHomes() {
        try {
            return unWrap(await fetch(`https://${appId}-dsn.algolia.net/1/indexes/homes`, {headers}
            ))
        } catch (error) {
            return getErrorResponse(error)
        }
    }

    async function getReviewsByHomeId(homeId) {

        try {
            return unWrap(
                await fetch(`https://${appId}-dsn.algolia.net/1/indexes/reviews/query`, {
                headers,
                method: 'POST',
                body: JSON.stringify({
                    filters: `homeId:${homeId}`,
                    hitsPerPage: 6,
                    attributesToHighlight: [],
                })
            }))
        } catch (error) {
            return getErrorResponse(error)
        }
    }

    async function getUserByHomeId(homeId) {
        try {
            return unWrap(
                await fetch(`https://${appId}-dsn.algolia.net/1/indexes/users/query`, {
                headers,
                method: 'POST',
                body: JSON.stringify({
                    filters: `homeId:${homeId}`,
                    attributesToHighlight: [],
                })
            }))
        } catch (error) {
            return getErrorResponse(error)
        }
    }

    async function getHomeByLocation(lat, lng, radiusInMeters = 1500) {
        try {
            return unWrap(
                await fetch(`https://${appId}-dsn.algolia.net/1/indexes/homes/query`, {
                headers,
                method: 'POST',
                body: JSON.stringify({
                    aroundLatLng: `${lat},${lng}`,
                    aroundRadius: radiusInMeters,
                    hitsPerPage: 10,
                    attributesToHighlight: [],
                })
            }))
        } catch (error) {
            return getErrorResponse(error)
        }
    }

    async function unWrap(response) {
        const json = await response.json()
        const {ok, status, statusText} = response
        return {
            json,
            ok,
            status,
            statusText,
        }
    }

    function getErrorResponse(error) {
        return {
            ok: false,
            status: 500,
            statusText: error.message,
            json: {},
        }
    }
}
