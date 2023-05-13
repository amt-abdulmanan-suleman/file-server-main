const LogoutBtn = document.querySelector('.logout') as HTMLButtonElement;

LogoutBtn.addEventListener('click',async(e)=>{
    e.preventDefault();
    const data = await logoutFunc();

    if(data.success){
        window.location.href = 'http://127.0.0.1:5500/client/index.html'
        localStorage.removeItem('profile');
    }else{
        console.log('error')
    }
})







const logoutFunc = async () =>{
    const infoString = localStorage.getItem('profile');
    let info;
    if(infoString){
       info = JSON.parse(infoString) 
    }
    const response = await fetch('http://localhost:3000/auth/logout',{
        method:'POST',
        headers:{
            'Content-type':'application/json',
            'Authorization':`Bearer ${info?.token}`,
        }
    })
    let data;
    if(response.ok){
        data = await response.json()
        return data
    }else{
        data = await response.text()
        return data
    }

}
