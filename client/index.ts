


const registerBtn = document.querySelector('.submit-reg-btn') as HTMLButtonElement
const verifyBtn = document.querySelector('.submit-verify-btn') as HTMLButtonElement
const loginBtn = document.querySelector('.login-btn') as HTMLButtonElement;
const usernameInput = document.querySelector('#name') as HTMLInputElement;
const emailLogInput = document.querySelector('#email-log') as HTMLInputElement;
const passwordLogInput = document.querySelector('#password-log') as HTMLInputElement;

const emailInput = document.querySelector('#email') as HTMLInputElement;
const passwordInput = document.querySelector('#password') as HTMLInputElement;

const verifyInput = document.querySelector('#verify-token') as HTMLInputElement;
const registerDiv = document.querySelector('.container-reg') as HTMLDivElement;
const verifyForm = document.querySelector('.verify-form') as HTMLFormElement;
const loginDiv = document.querySelector('.container-login') as HTMLDivElement;

const alreadyLoginBtn = document.querySelector('.already-btn-login') as HTMLButtonElement
const alreadyRegBtn = document.querySelector('.already-btn-reg') as HTMLButtonElement

const LoggedIn = localStorage.getItem('profile');

if(LoggedIn){
    window.location.href = 'http://127.0.0.1:5500/client/filesPage.html'
}

interface User {
    name: string,
    email: string,
    password:string
}

interface Credentials {
    email:string,
    password: string
}


const registerFunc = async(user:User) =>{
    
    const response = await fetch('http://localhost:3000/auth/signup',{
        method: 'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify(user)
    })
    return response;
}

const verifyFunc = async(token:string) =>{
    const response = await fetch(`http://localhost:3000/verify-email/${token}`,{
        method: 'POST',
        headers:{
            'Content-type':'application/json'
        }
    })
    return response;
}

const loginFunc = async(cred:Credentials)=>{
    const response = await fetch(`http://localhost:3000/auth/login`,{
        method: 'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify(cred)
    })
    return response
}

registerBtn.addEventListener('click',async(e)=>{
    e.preventDefault()
    const user:User = {
        name  : usernameInput.value,
        email: emailInput.value,
        password: passwordInput.value
    }
    const response = await registerFunc(user);
    const {success} = await response.json();
    if(success){
        registerDiv.classList.add('hide');
        verifyForm.classList.remove('hide');
    }
})


loginBtn.addEventListener('click',async(e)=>{
    e.preventDefault()
    const cred:Credentials = {
        email: emailLogInput.value,
        password: passwordLogInput.value
    }
    const response = await loginFunc(cred)
    const data = await response.json();
    console.log(data)
    if(data.success){
        window.location.href = 'http://127.0.0.1:5500/client/filesPage.html'
        localStorage.setItem('profile',data.id)
    }
})

verifyBtn.addEventListener('click',async(e)=>{
    e.preventDefault()

    const token = verifyInput.value;
    const response = await verifyFunc(token);

    const{success} = await response.json();

    if(success){
        window.location.href = 'http://127.0.0.1:5500/client/filesPage.html'
    }
})

alreadyLoginBtn.addEventListener('click',()=>{
    registerDiv.classList.add('hide');
    loginDiv.classList.remove('hide')
})
alreadyRegBtn.addEventListener('click',()=>{
    registerDiv.classList.remove('hide');
    loginDiv.classList.add('hide');
})