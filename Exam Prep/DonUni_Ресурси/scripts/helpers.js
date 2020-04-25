

export function displayError(message) {
    const errorNotification = document.getElementById('errorNotification');
    errorNotification.style.display='block';
    errorNotification.textContent=message;
    setTimeout(()=>{
      errorNotification.style.display='none';
    },2000)
  }

  export function displaySuccess(message) {
    const successNotification = document.getElementById('successNotification');
    successNotification.style.display='block';
    successNotification.textContent=message;
    setTimeout(()=>{
        successNotification.style.display='none';
    },2000)
  }

  export function getSessionInfo(ctx) {
    for (const key in sessionStorage) {
      if (sessionStorage.hasOwnProperty(key)) {
        ctx[key] = sessionStorage[key];
      }
    }
  }

  export function setHEaderInfo(ctx) {
    ctx.isLoggedIn = sessionStorage.getItem("authtoken") !== null;
    ctx.username = sessionStorage.getItem('username')
       
  }

  export function saveAuth(userInfo) {
    const userId = sessionStorage.setItem("userId", userInfo._id);
    const authtoken = sessionStorage.setItem("authtoken",userInfo._kmd.authtoken);
    const username = sessionStorage.setItem('username', userInfo.username);
   
  
  }


  export function displayLoading(){
    const loadingNotification = document.getElementById("loadingNotification");
    loadingNotification.style.display = "block";
    setTimeout(() => {
        loadingNotification.style.display = "none"
    }, 2000);
}
