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
//post check names of params and display error and success
this.post('#/login', function(ctx){
    const {username,password} = ctx.params

    post('user','login',{username,password},'Basic')
    .then(userInfo=>{
       displaySuccess('Login successful.')
   
       saveAuth(userInfo)
       ctx.redirect('#/')
    })
    .catch(()=>displayError('Error: Invalid credentials.Please retry your request with correct credentials.'))
})

this.get('#/register', function(ctx){
    this.loadPartials(getPartials())
    .partial('./templates/user/register.hbs')
})
//post
this.post('#/register', function(ctx) {
    const {username,password,rePassword} = ctx.params

    if(password===rePassword){
        post('user','',{username,password,rePassword},'Basic')
        .then(userInfo=>{
            displaySuccess('Registration successful.')
            ctx.redirect('#/login')
        })
        .catch(console.error)
    } else {
        ctx.redirect('#/register')
        displayError('Both passwords must be the same!')
    }
})

//post
this.get('#/logout', function(ctx){
    post('user','_logout',{},'Kinvey')
    .then(()=>{
        
        sessionStorage.clear();
        ctx.redirect('#/')
        displaySuccess('Logout successful.')
    })
    .catch(console.error)
})


//------------------------------------------------------------------------
this.get('#/create', function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);

    this.loadPartials(getPartials())
    .partial('./templates/causes/create.hbs')
})

this.post('#/create', function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    const {cause,pictureUrl,neededFunds,description}=ctx.params
    if(cause&& pictureUrl){
        post('appdata','causes',{cause,pictureUrl,neededFunds,description,collected:0,donors:[]},'Kinvey')
        .then(causeInfo=>{
            displaySuccess('Your cause was created successfully!')
            const id = causeInfo._id
            ctx.redirect('#/dashboard')
        })
        .catch(console.error)
    }
  

})

this.get('#/dashboard',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    displayLoading()
    get('appdata','causes','Kinvey')
    .then(causes=>{
        ctx.causes=causes;
        this.loadPartials(getPartials())
        .partial('./templates/causes/dashboard.hbs')
    })
    .catch(console.error)
 
})

this.get('#/details/:id', function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);

    const id = ctx.params.id
    
    get('appdata',`causes/${id}`,'Kinvey')
    .then(cause=>{
        ctx.cause=cause;
        console.log(cause)
       cause.isAuthor = sessionStorage.getItem('userId') === cause._acl.creator
        this.loadPartials(getPartials())
        .partial('./templates/causes/details.hbs')
    })
    .catch(console.error)
})

this.post('#/donate/:id',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    const id = ctx.params.id
    const username = sessionStorage.getItem('username')
    const currentDonation=Number(ctx.params.currentDonation)
    
    if(currentDonation){
        get('appdata',`causes/${id}`,'Kinvey')
        .then(cause=>{
            const collected=cause.collected+currentDonation
            if(!cause.donors.includes(username)){
                cause.donors.push(username)
            }
           
            put('appdata',`causes/${id}`,{
                cause:cause.cause,
                pictureUrl:cause.pictureUrl,
                neededFunds:cause.neededFunds,
                description:cause.description,
                collected:collected,
                donors:cause.donors
            },'Kinvey')
            .then(()=>{
                displaySuccess('You donated successfully!')
                ctx.redirect(`#/details/${id}`)
            })
            .catch(console.error)
          
        })
        .catch(console.error)
    }
    
   
})

this.get('#/delete/:id',function(ctx){
    const id =ctx.params.id
    console.log(id)
    del('appdata',`causes/${id}`,'Kinvey')
    .then(()=>{
ctx.redirect('#/dashboard')
    })
    .catch(console.error)
})
})

app.run('#/')
