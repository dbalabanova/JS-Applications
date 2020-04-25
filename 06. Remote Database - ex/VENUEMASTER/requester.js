const username = 'guest'
const password = 'pass'
const appKey = 'kid_BJ_Ke8hZg'
const baseUrl = 'https://baas.kinvey.com'

function makeHeaders(httpMethod,data){
    const headers = {
        method: httpMethod,
        headers:{
            'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
            'Content-Type': 'application/json'
        }
    }
    if(httpMethod==="POST" || httpMethod==='PUT'){
        headers.body = JSON.stringify(data)
    }
    return headers
}

function serializeData(x){
    return x.json()
}


function handleError(e){
    if(!e.ok){
        throw new Error(e.statusText)
    }
    return e
}

function fetchData(kinveyMethod,endpoint,headers){
const url = `${baseUrl}/${kinveyMethod}/${appKey}/${endpoint}`;
return fetch(url,headers)
.then(handleError)
.then(serializeData)
}

export function get(kinveyMethod,endpoint){
const headers = makeHeaders("GET")
return fetchData(kinveyMethod,endpoint,headers)
}

export function post(kinveyMethod,endpoint,data){
    const headers = makeHeaders("POST",data)
    return fetchData(kinveyMethod,endpoint,headers)
}