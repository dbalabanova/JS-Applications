import {get,post,put,del} from './requester.js'

function getPartials (){
    return {
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
        loginForm: './templates/login/loginForm.hbs',
        registerForm: './templates/register/registerForm.hbs',
        team: './templates/catalog/team.hbs',
        teamMember: './templates/catalog/teamMember.hbs',
        teamControls: './templates/catalog/teamControls.hbs',
        createForm: './templates/create/createForm.hbs',
        editForm: './templates/edit/editForm.hbs'
    }
}

const app = Sammy('#main', function(){
    this.use('Handlebars', 'hbs');

this.get('#/home',loadHome)
//------------------------------------------------------------


this.get('#/register', function(ctx){
 this.loadPartials(getPartials())
 .partial('./templates/register/registerPage.hbs')

})

this.post('#/register', function(ctx){
    // getSessionInfo(ctx)
    //console.log(ctx)
    const{username,password,repeatPassword}=ctx.params
if(password===repeatPassword){
    post('user','',{username,password},'Basic')
    .then(()=>{
        ctx.redirect('#/login')
    })
    .catch(console.error)
}
})

this.get('#/login',function(ctx){
    getSessionInfo(ctx)
    
    this.loadPartials(getPartials())
    .partial('./templates/login/loginPage.hbs')
})

this.post('#/login', function(ctx){
    getSessionInfo(ctx);
   
    const{username,password}=ctx.params

    post('user','login',{username,password},'Basic')
    .then(userInfo=>{
        
       sessionStorage.setItem('userId', userInfo._id);
       sessionStorage.setItem('authtoken', userInfo._kmd.authtoken)
       sessionStorage.setItem('creator',userInfo._acl.creator)
       sessionStorage.setItem('username',userInfo.username)
        ctx.redirect('#/home')
    })
    .catch(console.error)
})

this.get('#/logout', function(ctx){
    sessionStorage.clear()
    ctx.redirect('#/home')
})

this.get('#/about',function(ctx){
    getSessionInfo(ctx)

    this.loadPartials(getPartials())
    .partial('./templates/about/about.hbs')
})
//-----------------------------------

this.get('#/catalog',function(ctx){
    getSessionInfo(ctx)

    get('appdata','teams','Kinvey')
    .then(teamInfo=>{
       
        sessionStorage.setItem('teamId',teamInfo._id)
        ctx.teams = teamInfo
        ctx.hasNoTeam = true
        teamInfo.forEach((team)=>{
            if(team.members!=undefined){
                if(team.members.find(x=>x.nameMember===ctx.username)){
                    ctx.hasNoTeam=false
                }
            }
        })
        this.loadPartials(getPartials())
        .partial('./templates/catalog/teamCatalog.hbs')
    })
    .catch(console.error)
})

this.get('#/create',function(ctx){
    getSessionInfo(ctx)
this.loadPartials(getPartials())
.partial('./templates/create/createPage.hbs')
})

this.post('#/create', function(ctx){
getSessionInfo(ctx)
//console.log(ctx)
const{name, description} = ctx.params
const author = ctx.username
const members= [];
//console.log(ctx.teamId)
members.push({nameMember: ctx.username})

post('appdata','teams', {name,description,members,author},'Kinvey')
.then((info)=>{
ctx.redirect('#/catalog')
})
.catch(console.error)
})

this.get('#/catalog/:teamId',function(ctx){
    getSessionInfo(ctx)
    const teamId = ctx.params.teamId

    get('appdata',`teams/${teamId}`,'Kinvey')
    .then((detailsTeam)=>{
        //ctx.team = detailsTeam;
        const {name,description,author,members,_id}= detailsTeam
        ctx.name=name
        ctx.description=description
        ctx.members=members
        ctx.teamId = _id

        if(members!==undefined && author!==undefined){

            if(author===ctx.username){
                ctx.isAuthor=true
            }
            if(members.find(x=>x.nameMember===ctx.username)){
                ctx.isOnTeam =true
            }
        }
        this.loadPartials(getPartials())
        .partial('./templates/catalog/details.hbs')
    })
    .catch(console.error)
    
})

this.get('#/edit/:teamId',function(ctx){
    getSessionInfo(ctx)
    console.log(ctx)
   ctx.teamId = ctx.params.teamId
    this.loadPartials(getPartials())
        .partial('./templates/edit/editPage.hbs')

})

this.post('#/edit/:teamId', function(ctx){
   // console.log('yes')
   getSessionInfo(ctx)
const{name,description,teamId}=ctx.params

get('appdata',`teams/${teamId}`,'Kinvey')
.then(currTeam=>{
    currTeam.name=name
    currTeam.description=description
    return currTeam
    
})
.then(currTeam=>{
    put('appdata',`teams/${teamId}`,currTeam,'Kinvey')
    .then(res=>{
        ctx.redirect(`#/catalog/${teamId}`)

    })
})
//     console.log(ctx)
})

this.get('#/leave/:teamId',function(ctx){
    getSessionInfo(ctx)
    const teamId=ctx.params.teamId;
    //console.log(ctx)
    get('appdata',`teams/${teamId}`,'Kinvey')
    .then(teamInfo=>{
        if(teamInfo.members!==undefined){
            if(teamInfo.members.find(x=>x.nameMember===ctx.username)){
                teamInfo.members= teamInfo.members.filter(x=>x.nameMember!==ctx.username)
            }
           
        }
       put('appdata',`teams/${teamId}`, teamInfo,'Kinvey')
       .then(()=>{
           ctx.redirect(`#/catalog/${teamId}`)
       })
    })
    .catch(console.error)



})

this.get('#/join/:teamId',function(ctx){
    getSessionInfo(ctx)

    

    get('appdata','teams','Kinvey')
    .then(info=>{
       
        ctx.teams = info
        ctx.hasNoTeam = true
        info.forEach((team)=>{
            if(team.members!=undefined){
                if(team.members.find(x=>x.nameMember===ctx.username)){
                    ctx.hasNoTeam=false
                }
            }
        })
       
    })
    .catch(console.error)

    const teamId = ctx.params.teamId;
    get('appdata',`teams/${teamId}`,'Kinvey')
    .then(teamInfo=>{
        
        if(ctx.hasNoTeam===true && teamInfo.members!==undefined){
            teamInfo.members.push({nameMember: ctx.username})

            put('appdata',`teams/${teamId}`,teamInfo,'Kinvey')
            .then(()=>{
                ctx.redirect(`#/catalog/${teamId}`)
            })
        }
        else {
            
            alert('You are already member of another team!')
        }
    })
    .catch(console.error)
})

})

function getSessionInfo(ctx){
    ctx.userId=sessionStorage.getItem('userId')
    ctx.loggedIn=sessionStorage.getItem('authtoken')!==null
    ctx.creator = sessionStorage.getItem('creator')
    ctx.username = sessionStorage.getItem('username')
}

function loadHome(ctx){
    getSessionInfo(ctx)
    this.loadPartials(getPartials())
    .partial('./templates/home/home.hbs')
}

function ifHasTeam(ctx){
  
}
app.run('#/home')
