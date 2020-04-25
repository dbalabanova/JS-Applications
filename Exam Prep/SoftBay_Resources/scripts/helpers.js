

export function displayError(message) {
    const errorBox = document.getElementById('errorBox');
    errorBox.style.display='block';
    errorBox.textContent=message;
    setTimeout(()=>{
      errorBox.style.display='none';
    },2000)
  }

  export function displaySuccess(message) {
    const successBox = document.getElementById('successBox');
    successBox.style.display='block';
    successBox.textContent=message;
    setTimeout(()=>{
        successBox.style.display='none';
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
    ctx.userId = sessionStorage.getItem('userId')
    ctx.purchases = sessionStorage.getItem('purchases')
       
  }

  export function saveAuth(userInfo) {
    const userId = sessionStorage.setItem("userId", userInfo._id);
    const authtoken = sessionStorage.setItem("authtoken",userInfo._kmd.authtoken);
    const username = sessionStorage.setItem('username', userInfo.username);
   const purchases=sessionStorage.setItem('purchases',userInfo.purchases)
  
  }


  export function displayLoading(){
    const loadingBox = document.getElementById("loadingNotification");
    loadingBox.style.display = "block";
    setTimeout(() => {
        loadingBox.style.display = "none"
    }, 2000);
}
