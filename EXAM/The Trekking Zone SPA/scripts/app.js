import { get, post, put, del } from "./requester.js";
import {
  displayError,
  displaySuccess,
  getSessionInfo,
  setHEaderInfo,
  saveAuth,
  displayLoading
} from "./helpers.js";

function getPartials() {
  return {
    header: "./templates/common/header.hbs",
    footer: "./templates/common/footer.hbs"
  };
}

const app = Sammy("#main", function() {
  this.use("Handlebars", "hbs");

  this.get("#/", function(ctx) {
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    if (ctx.isLoggedIn) {
      get("appdata", "treks", "Kinvey").then(treks => {
        treks.sort((a,b)=>b.likes-a.likes)
        ctx.treks = treks;
        this.loadPartials(getPartials())
        .partial("./templates/home.hbs")
      });
    } else {
        this.loadPartials(getPartials())
        .partial("./templates/home-anonymous.hbs")
    }
  });

  //--------------------------------------------------------------------------------

  this.get("#/login", function(ctx) {
    setHEaderInfo(ctx);
    getSessionInfo(ctx);

    this.loadPartials(getPartials()).partial("./templates/user/login.hbs");
  });

  this.post("#/login", function(ctx) {
    const { username, password } = ctx.params;

    post("user", "login", { username, password }, "Basic")
      .then(userInfo => {
        displaySuccess("Successfully logged user.");

        saveAuth(userInfo);
        ctx.redirect("#/");
      })
      .catch(() =>
        displayError(
          "Error: Invalid credentials.Please retry your request with correct credentials."
        )
      );
  });

  this.get("#/register", function(ctx) {
    this.loadPartials(getPartials()).partial("./templates/user/register.hbs");
  });

  this.post("#/register", function(ctx) {
    const { username, password, rePassword } = ctx.params;
    if (
      password.length >= 6 &&
      username.length >= 3 &&
      password === rePassword
    ) {
      post("user", "", { username, password}, "Basic")
        .then(userInfo => {
          displaySuccess("Successfully registered user.");
          ctx.redirect("#/login");
        })
        .catch(console.error);
    } else {
      ctx.redirect("#/register");
      displayError(
        "Password must be at least 6 characters and must be the sam as rePassword snd username must be at least 3 characters! Try again!"
      );
    }
  });

  this.get("#/logout", function(ctx) {
    post("user", "_logout", {}, "Kinvey")
      .then(() => {
        sessionStorage.clear();
        ctx.redirect("#/");
        displaySuccess("Logout successful.");
      })
      .catch(console.error);
  });

  //------------------------------------------------------------------------

  this.get("#/create", function(ctx) {
    setHEaderInfo(ctx);
    getSessionInfo(ctx);

    this.loadPartials(getPartials()).partial("./templates/treks/create.hbs");
  });

  this.post("#/create", function(ctx) {
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    const { location, dateTime, description, imageURL } = ctx.params;
    if (location.length >= 6 && description.length >= 10) {
        post('appdata','treks',{location, dateTime, description, imageURL,likes:0,organizer:ctx.username})
        .then(trek=>{
            displaySuccess('Trek created successfully.')
            ctx.id =trek._id
           // console.log(trek)
            ctx.redirect('#/')
        })
        .catch(console.error)
    } else {
      displayError("Invalid input");
      ctx.redirect('#/create')
    }
  });

  this.get('#/details/:id', function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    const id = ctx.params.id

    get('appdata',`treks/${id}`,'Kinvey')
    .then(trek=>{
        ctx.trek=trek
        trek.isAuthor=sessionStorage.getItem('userId')===trek._acl.creator
        this.loadPartials(getPartials())
        .partial('./templates/treks/details.hbs')
    })
    .catch(console.error)
  })

  this.get('#/edit/:id',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    const id = ctx.params.id
    get('appdata',`treks/${id}`,'Kinvey')
    .then(trek=>{
        ctx.trek=trek
        this.loadPartials(getPartials())
        .partial('./templates/treks/edit.hbs')
    })
    .catch(console.error)
  })

  this.post('#/edit/:id',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    const id = ctx.params.id
    const currLikes = Number(ctx.params.likes)
    //console.log(currLikes)
    const {location, 
        dateTime, 
        description, 
        imageURL,
        likes,
        organizer}=ctx.params
        put('appdata',`treks/${id}`,{
            location,
            dateTime, 
            description, 
            imageURL,
            likes:currLikes,
            organizer
        },'Kinvey')
        .then(()=>{
            displaySuccess('Trek edited successfully.')
            ctx.redirect(`#/details/${id}`)
        })
        .catch(console.error)
  })

  this.get('#/delete/:id',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    const id = ctx.params.id

    del('appdata',`treks/${id}`,'Kinvey')
    .then(()=>{
        displaySuccess('You closed the trek successfully.')
        ctx.redirect('#/')
    })
    .catch(console.error)
  })

  this.get('#/like/:id',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    const id = ctx.params.id
    get('appdata',`treks/${id}`,'Kinvey')
    .then(trek=>{
        const{
        location,
        dateTime, 
        description, 
        imageURL,
        likes,
        organizer
        } = trek
        put('appdata',`treks/${id}`,{
            location,
            dateTime, 
            description, 
            imageURL,
            likes:trek.likes+=1,
            organizer:trek.organizer
        },'Kinvey')
        .then(trek=>{
            ctx.trek=trek
            displaySuccess("You liked the trek successfully.")
            ctx.redirect(`#/details/${id}`)
        })
        .catch(console.error)
    })
    .catch(console.error)
   
  })

  this.get('#/profile',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    get('appdata','treks','Kinvey')
    .then(treks=>{
        ctx.treks=treks.filter(x=>x._acl.creator===ctx.userId)
        this.loadPartials(getPartials())
        .partial('./templates/user/profile.hbs')
    })
    .catch(console.error)
  })
});

app.run("#/");
