import {get,post,put,del} from './requester.js'
import {displayError,displaySuccess,getSessionInfo,setHEaderInfo,saveAuth, displayLoading} from './helpers.js'

function getPartials(){
    return {
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs'
    }
}
// '#/ CONTAINER'
const app = Sammy('#main', function(){
this.use('Handlebars','hbs')


this.get('#/',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    this.loadPartials(getPartials())
    .partial('./templates/home.hbs')
})

//--------------------------------------------------------------------------------

this.get('#/login',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);

    this.loadPartials(getPartials())
    .partial('./templates/user/login.hbs')
  
})
//post
this.post('#/login', function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
 const {username,password,purchases}= ctx.params
  post('user','login',{username,password,purchases},'Basic')
    .then(userInfo=>{
        console.log(userInfo)
        saveAuth(userInfo);
        ctx.redirect('#/')
    })
    .catch(console.error)
})

this.get('#/register', function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);

    this.loadPartials(getPartials())
    .partial('./templates/user/register.hbs')
})
//post
this.post('#/register', function(ctx) {
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
   
    const {username,password,rePassword}=ctx.params
    
    if(username && password===rePassword) {
        post('user','',{username,password,rePassword,purchases:0},'Basic')
        .then(userInfo=>{
           // saveAuth(userInfo);
            ctx.redirect('#/login')
        })
        .catch(console.error)
    }
  
})

//post
this.get('#/logout', function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    post('user','_logout',{},'Kinvey')
    .then(event=>{
        sessionStorage.clear();
        ctx.redirect('#/')
    })
})


//------------------------------------------------------------------------

this.get('#/create',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
this.loadPartials(getPartials())
.partial('./templates/offers/create.hbs')
    
})

this.post('#/create',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);

    const {product,description,price,pictureUrl} = ctx.params
    
    post('appdata','offers',{product,description,price,pictureUrl},'Kinvey')
    .then(productInfo=>{
        console.log(productInfo)
        const id = productInfo._id;
        ctx.redirect('#/dashboard')
    })
    .catch(console.error)
})

this.get('#/dashboard',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
get('appdata','offers','Kinvey')
.then(offers=>{
    ctx.offers=offers

    //If needs counting
    
    Object.keys(offers)
    .forEach(key=>{
        ctx.key=key
    })

    this.loadPartials(getPartials())
    .partial('./templates/offers/dashboard.hbs')
})
})

this.get('#/edit/:id',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    const id = ctx.params.id

   get('appdata',`offers/${id}`,'Kinvey')
   .then(offer=>{
       ctx.offer=offer
       const {product,description,price,pictureUrl}=ctx.offer
        this.loadPartials(getPartials())
        .partial('./templates/offers/edit.hbs')

   })
   .catch(console.error)
})

this.post('#/edit/:id',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    const id = ctx.params.id
    const {product,description,price,pictureUrl}=ctx.params
  
    put('appdata',`offers/${id}`,{product,description,price,pictureUrl},'Kinvey')
    .then(offer=>{
        ctx.offer=offer;
        ctx.redirect('#/dashboard')
    })
.catch(console.error)
})

this.get('#/delete/:id',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    const id = ctx.params.id
  
    get('appdata',`offers/${id}`,'Kinvey')
    .then(offer=>{
        ctx.offer=offer
        this.loadPartials(getPartials())
        .partial('./templates/offers/delete.hbs')
    })
    .catch(console.error)
})

this.post('#/delete/:id',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    const id = ctx.params.id
    
   del('appdata',`offers/${id}`,'Kinvey')
    .then(()=>{
        ctx.redirect('#/dashboard')
    })
    .catch(console.error)
})
this.get('#/details/:id',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    const id = ctx.params.id
    get('appdata',`offers/${id}`,'Kinvey')
    .then(offer=>{
        ctx.offer=offer
        this.loadPartials(getPartials())
        .partial('./templates/offers/details.hbs')
    })
    
})

this.get('#/buy/:id',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    const id = ctx.params.id
   const purchases =ctx.params.purchases++;
    console.log(purchases )
    
})

})

app.run('#/')
