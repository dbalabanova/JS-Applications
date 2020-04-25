const username ="Deni"
const password = "deni"
const baseUrl = 'https://baas.kinvey.com'
const appKey = 'kid_rke3k9aiB'
const appSecret ='c90a0f4759f34ba99ea85d2ba91ca407'

function makeHeaders(httpMethod,data){
const headers = {
    method: httpMethod,
    headers: {
        
        'Content-Type' : 'application/json'
    }
}
if(httpMethod==="POST" || httpMethod==="PUT"){
    headers.body = JSON.stringify(data)
}
return headers
}

function handleError(e){
    if(!e.ok){
        throw new Error(e.statusText)
    }
    return e
}

function serializeData(x){
    return x.json()
}
function fetchData(kinveyModule,endpoint,headers){
    const url = `${baseUrl}/${kinveyModule}/${appKey}/${endpoint}`

    return fetch(url,headers)
            .then(handleError)
            .then(serializeData)
}
 export function get (kinveyModule, endpoint) {
    const headers = makeHeaders("GET")
  return fetchData(kinveyModule,endpoint,headers)
}

export function post(kinveyModule,endpoint,data) {
    const headers = makeHeaders("POST", data)
    return fetchData(kinveyModule,endpoint,headers)
}

export function put(kinveyModule,endpoint,data) {
    const headers= makeHeaders("PUT",data)

    return fetchData(kinveyModule,endpoint,headers)
}

export function del(kinveyModule,endpoint){
    const headers = makeHeaders("DELETE")

    return fetchData(kinveyModule,endpoint,headers)
}