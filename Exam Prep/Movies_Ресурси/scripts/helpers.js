

export function displayError(message) {
    const errorBox = document.getElementById('errorBox');
    errorBox.style.display='block';
    const errorBoxSpan= document.querySelector('#errorBox >span')
    errorBoxSpan.textContent=message;
    setTimeout(()=>{
      errorBox.style.display='none';
    },2000)
  }

  export function displaySuccess(message) {
    const infoBox = document.getElementById('infoBox')
    const infoBoxSpan = document.querySelector('#infoBox >span');
  
   infoBox.style.display='block'
   infoBoxSpan.textContent=message;
    setTimeout(()=>{
        infoBox.style.display='none';
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
    const loadingBox = document.getElementById("loadingBox");
    loadingBox.style.display = "block";
    setTimeout(() => {
        loadingBox.style.display = "none"
    }, 2000);
}
