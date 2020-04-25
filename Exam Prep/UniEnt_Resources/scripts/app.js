import {get,post,put,del} from './requester.js'
import {displayError, displaySuccess, getSessionInfo, setHEaderInfo,saveAuth} from './helpers.js'
function getPartials(){
    return {
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs'
    }
}
const app = Sammy('#main', function(){
    this.use('Handlebars', 'hbs')

    this.get('#/',function(ctx){
        setHEaderInfo(ctx);
        getSessionInfo(ctx)
        if(ctx.isLoggedIn){

            get('appdata','events','Kinvey')
            .then(events=>{
                 //events.isAuthor = sessionStorage.getItem('userId') === events._acl.creator
                ctx.events=events;
                this.loadPartials(getPartials())
                .partial('./templates/home.hbs')
            })
           
        } else {
            this.loadPartials(getPartials())
            .partial('./templates/home-anonymous.hbs')
        }
       
    })
    
    //------------------------------------------------------------

    this.get('#/login',function(ctx){
        setHEaderInfo(ctx)
        this.loadPartials(getPartials())
        .partial('./templates/auth/login.hbs')
    })

    this.post('#/login', function(ctx){
     
       const{username,password}=ctx.params
       if(username&& password){
        post('user','login',{username,password},'Basic')
        .then((userInfo)=>{
            saveAuth(userInfo);
          
         displaySuccess('Login successful.')
           ctx.redirect('#/')
        })
        .catch(()=>{
            alert('Something went wrong.Please try again!')
            ctx.redirect('#/login')
        })
       }
        
    })

    this.get('#/register', function(ctx){
        this.loadPartials(getPartials())
        .partial('./templates/auth/register.hbs')
    })

    this.post('#/register',function(ctx){
        const {username, password, rePassword} = ctx.params
        if(password===rePassword){
         
            post('user','',{username,password},'Basic')
            .then((userInfo)=>{
                saveAuth(userInfo);
              
                displaySuccess('User registration successful.')
                ctx.redirect('#/login')
            })
            .catch(()=>displayError('Something went wrong.'))
        }
    })

    this.get('#/logout', function(ctx){
        setHEaderInfo(ctx);

        post('user','_logout',{}, 'Kinvey')
        .then(()=>{
            displaySuccess('Logout successful')
            sessionStorage.clear();

            ctx.redirect('#/')
        })
        .catch(console.error)

    })
//---------------------------------

this.get('#/create', function(ctx){
    setHEaderInfo(ctx);

    this.loadPartials(getPartials())
    .partial('./templates/events/createForm.hbs')
})

this.post('#/create',function(ctx){
    getSessionInfo(ctx)
    setHEaderInfo(ctx);

    const {name,dateTime,description, imageURL} = ctx.params;
   // console.log(ctx.username)
    if (name&&dateTime&& description && imageURL){
        post('appdata','events',{name,
            dateTime,
            description,
            imageURL,
            peopleInterestedIn:0,
            organiser: ctx.username
        },'Kinvey')
    .then((event)=>{
       
        ctx.id = event._id
        
        ctx.redirect('#/')
    })
    .catch(console.error)
} else {
    displayError('There are some empty spaces')
    ctx.redirect('#/create')
}
})

this.get('#/details/:id',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx)
    const id = ctx.params.id
  
    get('appdata',`events/${id}`,'Kinvey')
    .then((event)=>{
        ctx.event=event
        event.isAuthor = sessionStorage.getItem('userId') === event._acl.creator
        this.loadPartials(getPartials())
        .partial('./templates/events/details.hbs')
    })
})

this.get('#/edit/:id',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx)
    const id=ctx.params.id
    get('appdata',`events/${id}`,'Kinvey')
    .then(event=>{
        ctx.event=event;

        this.loadPartials(getPartials())
        .partial('./templates/events/editForm.hbs')
    })
    .catch(console.error)
   
})
this.post('#/edit/:id',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx)
    
   const id = ctx.params.id
   const {name,
    dateTime,
    description,
    imageURL} = ctx.params

    put('appdata',`events/${id}`,{name,
        dateTime,
        description,
        imageURL,
        organiser: ctx.username,
        peopleInterestedIn:0
    },'Kinvey')
        .then(()=>{
            displaySuccess('Event edited successfully.')
            ctx.redirect('#/')
        })
        .catch(console.error)
})

this.get('#/remove/:id',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    const id = ctx.params.id

    del('appdata',`events/${id}`,'Kinvey')
    .then(()=>{
       
        displaySuccess('Event closed successfully.')
        ctx.redirect('#/')
    })
})

this.get('#/join/:id', function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    const id = ctx.params.id
    //console.log(ctx)
    get('appdata',`events/${id}`,'Kinvey')
    .then((event)=>{
        //ctx.event=event;
        const {name,
            dateTime,
            description,
            imageURL,
            organiser,
            peopleInterestedIn
        } = event
put('appdata',`events/${id}`,{name,
    dateTime,
    description,
    imageURL,
    organiser,
    peopleInterestedIn:event.peopleInterestedIn+=1},'Kinvey')
    .then((event)=>{
        ctx.event=event
        ctx.redirect(`#/details/${id}`)
        displaySuccess('You join the event successufully.')
    })
    })
    
})

this.get('#/profile',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
   get('appdata','events','Kinvey').then(events=>{
    ctx.events=events.filter(x=>x._acl.creator===ctx.userId)
    this.loadPartials(getPartials())
    .partial('./templates/auth/profile.hbs')
   })
   
    
})

})

app.run('#/')