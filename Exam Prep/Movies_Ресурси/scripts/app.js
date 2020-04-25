import {get,post,put,del} from './requester.js'
import {displayError,displaySuccess,getSessionInfo,setHEaderInfo,saveAuth,displayLoading} from './helpers.js'

function getPartials(){
    return {
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs'
    }
}

const app = Sammy('#container', function(){
this.use('Handlebars','hbs')

this.get('#/',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    if(ctx.isLoggedIn){
        this.loadPartials(getPartials())
        .partial('./templates/home.hbs')
    }else {
        this.loadPartials(getPartials())
        .partial('./templates/home-anonymous.hbs')
    }
   
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
const {username,password,repeatPassword} = ctx.params
if(password===repeatPassword){
    post('user','',{username,password,repeatPassword},'Basic')
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

this.get('#/add',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
this.loadPartials(getPartials())
.partial('./templates/movies/addForm.hbs')
})

this.get('#/movies',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);

    get('appdata','movies?query={}&sort={}','Kinvey')
    .then(movies=>{
        ctx.movies=movies;
       //console.log(movies)
        this.loadPartials(getPartials())
        .partial('./templates/movies/allMovies.hbs')
    })
})

this.post('#/add', function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
const {title,imageUrl,description,genres, tickets} = ctx.params
    displayLoading()
    
    post('appdata','movies',{title,imageUrl,description,genres, tickets},'Kinvey')
    .then(movieInfo=>{
        //console.log(movieInfo)
        const id=movieInfo._id;
        ctx.redirect('#/movies')
        displaySuccess('Movie created successfully.')
    })
})

this.get('#/details/:id', function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    const id = ctx.params.id
    get('appdata',`movies/${id}`,'Kinevy')
    .then(movie=>{
        ctx.movie = movie;
   // console.log(movie)
        this.loadPartials(getPartials())
        .partial('./templates/movies/details.hbs')
    })

})

this.get('#/buy/:id', function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    const id = ctx.params.id
    get('appdata',`movies/${id}`,'Kinvey')
    .then(movie=>{
        ctx.movie= movie;
      //  const {title,imageUrl,description,genres, tickets}=ctx.movie
        
        put('appdata',`movies/${id}`,{
            title:movie.title,
            imageUrl:movie.imageUrl,
            description:movie.description,
            genres:movie.genres,
            tickets:movie.tickets-=1
        },'Kinvey')
        .then(event=>{
            
            displaySuccess(`Successfully bought ticket for ${event.title}!`)
            ctx.redirect(`#/movies`)

        })
   })
})

this.get('#/myMovies',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);

    get('appdata','movies','Kinevy')
    .then(movies=>{
        ctx.movie = movies.filter(x=>x._acl.creator===sessionStorage.getItem('userId'))
        this.loadPartials(getPartials())
        .partial('./templates/movies/myMovies.hbs')
    })
})

this.get('#/delete/:id',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    const id = ctx.params.id

    get('appdata',`movies/${id}`,'Kinvey')
    .then(movie=>{
        ctx.movie = movie;
        //console.log(movie._id)
       this.loadPartials(getPartials())
       .partial('./templates/movies/deleteForm.hbs') 
    
    })

})

this.post('#/delete/:id',function(ctx){
       
    const id = ctx.params.id
        del('appdata',`movies/${id}`,'Kinvey')
.then(()=>{
    displaySuccess('Movie removed successfully!')
    ctx.redirect('#/myMovies')
})
})
this.get('#/edit/:id',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    const id = ctx.params.id
    get('appdata',`movies/${id}`,'Kinvey')
    .then(movie=>{
        ctx.movie = movie;
        const{title,imageUrl,description,genres, tickets}=ctx.movie;
        this.loadPartials(getPartials())
        .partial('./templates/movies/editForm.hbs')
    })
})

this.post('#/edit/:id',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    const id = ctx.params.id
    
        const{title,imageUrl,description,genres, tickets}=ctx.params;
        put('appdata',`movies/${id}`,{title,imageUrl,description,genres, tickets},'Kinvey')
        .then(movie=>{
            ctx.movie=movie
            ctx.redirect(`#/details/${id}`)
        })

})

this.get('#/search',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    const genre = ctx.params.search;
    get('appdata',`movies`,'Kinvey')
    .then(movies=>{
        
        ctx.movies = movies.filter(x=>x.genres===genre);
        //console.log(ctx.movies)
        this.loadPartials(getPartials())
        .partial('./templates/movies/allMovies.hbs')
    })
})

this.get('#/buy/:id',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    const id = ctx.params.id
    console.log(id)
})

})

app.run('#/')
