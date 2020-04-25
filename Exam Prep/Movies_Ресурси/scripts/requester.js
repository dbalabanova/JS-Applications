// const username = "Deni";
// const password = "deni";
const appKey = "kid_rke3k9aiB";
const appSecret = "c90a0f4759f34ba99ea85d2ba91ca407";
const baseUrl = "https://baas.kinvey.com";

function createAuthorization(type){
 if( type ==='Basic'){
     return `Basic ${btoa(`${appKey}:${appSecret}`)}`
 } else {
     return `Kinvey ${sessionStorage.getItem('authtoken')}`
 }
}

function makeHeaders(type, httpMethod, data) {
  const headers = {
    method: httpMethod,
    headers: {
      Authorization: createAuthorization(type),
      "Content-Type": "application/json"
    }
  };
  if (httpMethod === "POST" || httpMethod === "PUT") {
    headers.body = JSON.stringify(data);
  }
  return headers;
}
function serializeData(x) {
  // в description-a е описано when we logout we need to make a post request
  if(x.status===204){
    return x;
  }
  return x.json();

}
function handleError(e) {
  if (!e.ok) {
    throw new Error(e.statusText);
  }
  return e;
}
function fetchData(kinveyModule,endpoint,headers) {
    const url = `${baseUrl}/${kinveyModule}/${appKey}/${endpoint}`
    return fetch(url,headers)
    .then(handleError)
    .then(serializeData)
}
export function get(kinveyModule,endpoint,type ) {
    const headers = makeHeaders(type,"GET")
    return fetchData(kinveyModule,endpoint,headers)
}

export function post(kinveyModule,endpoint,data,type) {
    const headers = makeHeaders(type,"POST",data)
    return  fetchData(kinveyModule,endpoint,headers)
}

export function put(kinveyModule,endpoint,data,type) {
    const headers= makeHeaders(type,"PUT",data)

    return fetchData(kinveyModule,endpoint,headers)
}

export function del(kinveyModule,endpoint,type){
    const headers = makeHeaders(type,"DELETE")

    return fetchData(kinveyModule,endpoint,headers)
}
