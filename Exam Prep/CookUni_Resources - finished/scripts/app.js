import { get, post, put, del } from "./requester.js";

function getPartials() {
  return {
    header: "./templates/common/header.hbs",
    footer: "./templates/common/footer.hbs"
  };
}

const app = Sammy("#rooter", function() {
  this.use("Handlebars", "hbs");

  this.get("/", function(ctx) {
    setHEaderInfo(ctx);
    if (ctx.isLoggedIn) {
      get("appdata", "recipes", "Kinevy").then(recipes => {
        // const{meal,ingredients,category,prepMethod,description,foodImageURL,categoryImageURL,likesCounter} = recipes
        ctx.recipes = recipes;
        this.loadPartials(getPartials()).partial("./templates/home.hbs");
      });
    } else {
      this.loadPartials(getPartials()).partial(
        "./templates/home-anonymous.hbs"
      );
    }
  });

  //------------------------------------------------------------------------------

  this.get("/register", function(ctx) {
    setHEaderInfo(ctx);
    this.loadPartials(getPartials()).partial(
      "./templates/register/registerForm.hbs"
    );
  });

  this.post("/register", function(ctx) {
    setHEaderInfo(ctx);
    const firstName = ctx.params.firstName;
    const lastName = ctx.params.lastName;
    const username = ctx.params.username;
    const password = ctx.params.password;
    const repeatPassword = ctx.params.repeatPassword;

    if (password === repeatPassword) {
      post("user", "", { firstName, lastName, password, username }, "Basic")
        .then(userInfo => {
          saveAuth(userInfo);
          ctx.redirect("/login");
        })
        .catch(()=> displayError('This user already exists!'));
    } else {
      alert("Password and ReapeatPassword are not correct!");
    }
  });

  this.get("/login", function(ctx) {
    this.loadPartials(getPartials()).partial("./templates/login/loginForm.hbs");
  });

  this.post("/login", function(ctx) {
    setHEaderInfo(ctx);
    const username = ctx.params.username;
    const password = ctx.params.password;

    post("user", "login", { username, password }, "Basic").then(userInfo => {
      saveAuth(userInfo);
      ctx.redirect("/");
    })
    .catch(()=>displayError('Something went wrong!'))
  });

  this.get("/logout", function(ctx) {
    setHEaderInfo(ctx);
    post("user", "_logout", {}, "Kinvey")
      .then(() => {
        sessionStorage.clear();
        ctx.redirect("/");
      })
      .catch(console.error);
  });

  //------------------------------------------------------------------------------

  this.get("/create", function(ctx) {
    setHEaderInfo(ctx);
    this.loadPartials(getPartials()).partial("./templates/recipes/create.hbs");
  });

  this.post("/create", function(ctx) {
    setHEaderInfo(ctx);
    // const creator = [];
    // creator.push(ctx.creator);
    const categoryPictures = {
      "Grain Food":
        "https://cdn.pixabay.com/photo/2014/12/11/02/55/corn-syrup-563796__340.jpg",
      'Fruits':
        "https://cdn.pixabay.com/photo/2017/06/02/18/24/fruit-2367029__340.jpg",
      "Lean meats and poultry, fish and alternatives":
        "https://t3.ftcdn.net/jpg/01/18/84/52/240_F_118845283_n9uWnb81tg8cG7Rf9y3McWT1DT1ZKTDx.jpg",
      "Milk, chees, eggs and alternatives":
        "https://image.shutterstock.com/image-photo/assorted-dairy-products-milk-yogurt-260nw-530162824.jpg",
      "Vegetables and legumes/beans":
        "https://cdn.pixabay.com/photo/2017/10/09/19/29/eat-2834549__340.jpg"
    };
    const {
      meal,
      ingredients,
      category,
      prepMethod,
      description,
      foodImageURL
    } = ctx.params;
    if (
      meal &&
      ingredients &&
      category &&
      prepMethod &&
      description &&
      foodImageURL
    ) {
      post(
        "appdata",
        "recipes",
        {
          meal,
          ingredients: ingredients.split(" "),
          category,
          prepMethod,
          description,
          foodImageURL,
          categoryImageURL: categoryPictures[category],
          likesCounter: 0,
          //creator
        },
        "Kinvey"
      ).then(details => {
        // const lmt = details._kmd.lmt
        // const ect = details._kmd.ect

        ctx.redirect("/");
      });
    }
  });

  this.get(`/recipe/:id`, function(ctx) {
    setHEaderInfo(ctx);
    getSessionInfo(ctx);

    const id = ctx.params.id;
    let isAuthor;

    get("appdata", `recipes/${id}`, "Kinvey")
    .then(recipe => {
      ctx.recipe = recipe;
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11111111
      recipe.isAuthor = sessionStorage.getItem("userId") === recipe._acl.creator;
      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 
      this.loadPartials(getPartials()).partial(
        "../templates/recipes/details.hbs"
      );
    });
  });
  this.get("/edit/:id", function(ctx) {
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    const id = ctx.params.id;
    get("appdata", `recipes/${id}`, "Kinevy").then(recipe => {
      recipe.ingredients=recipe.ingredients.join(' ')
      ctx.recipe = recipe;
      this.loadPartials(getPartials()).partial(
        "../templates/recipes/editForm.hbs"
      );
    });
  });

  this.post("/edit/:id", function(ctx) {
    setHEaderInfo(ctx);
    getSessionInfo(ctx);

    const id = ctx.params.id;
    //console.log(id)
    const {
      meal,
      ingredients,
      prepMethod,
      description,
      foodImageURL,
      category,
      
    } = ctx.params;
    const categoryPictures = {
      "Grain Food":
        "https://cdn.pixabay.com/photo/2014/12/11/02/55/corn-syrup-563796__340.jpg",
      'Fruits':
        "https://cdn.pixabay.com/photo/2017/06/02/18/24/fruit-2367029__340.jpg",
      "Lean meats and poultry, fish and alternatives":
        "https://t3.ftcdn.net/jpg/01/18/84/52/240_F_118845283_n9uWnb81tg8cG7Rf9y3McWT1DT1ZKTDx.jpg",
      "Milk, chees, eggs and alternatives":
        "https://image.shutterstock.com/image-photo/assorted-dairy-products-milk-yogurt-260nw-530162824.jpg",
      "Vegetables and legumes/beans":
        "https://cdn.pixabay.com/photo/2017/10/09/19/29/eat-2834549__340.jpg"
    };
    put(
      "appdata",
      `recipes/${id}`,
      {
        meal,
        ingredients: ingredients.split(" "),
        category,
        prepMethod,
        description,
        foodImageURL,
        categoryImageURL:categoryPictures[category]
      },
      "Kinevy"
    ).then(recipe => {
      // isAuthor=true
      ctx.redirect("/");
    });
  });

  this.get('/archive/:id',function(ctx){
    setHEaderInfo(ctx);
    getSessionInfo(ctx);
    const id = ctx.params.id;
    console.log(id)
    del('appdata',`recipes/${id}`,'Kinvey')
    .then((x)=>{
        ctx.redirect('/')
    })
  })


  this.get ('/like/{{recipe._id}',function(ctx){

  })

});

function setHEaderInfo(ctx) {
  ctx.isLoggedIn = sessionStorage.getItem("authtoken") !== null;
  ctx.fullName = `${sessionStorage.getItem(
    "firstName"
  )} ${sessionStorage.getItem("lastName")}`;
  ctx.firstName = sessionStorage.getItem("firstName");
  ctx.lastName = sessionStorage.getItem("lastName");
  ctx.userId = sessionStorage.getItem("userId");
  ctx.creator = sessionStorage.getItem("creator");
}
function saveAuth(userInfo) {
  const userId = sessionStorage.setItem("userId", userInfo._id);
  const creator = sessionStorage.setItem("creator", userInfo._acl.creator);
  const authtoken = sessionStorage.setItem(
    "authtoken",
    userInfo._kmd.authtoken
  );
  const fistName = sessionStorage.setItem("firstName", userInfo.firstName);
  const lastName = sessionStorage.setItem("lastName", userInfo.lastName);
}
function getSessionInfo(ctx) {
  for (const key in sessionStorage) {
    if (sessionStorage.hasOwnProperty(key)) {
      ctx[key] = sessionStorage[key];
    }
  }
}

function displayError(message) {
  const errorBox = document.getElementById('errorBox');
  errorBox.style.display='block';
  errorBox.textContent=message;
  setTimeout(()=>{
    errorBox.style.display='none';
  },2000)
}
app.run("/");
