


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
const errorList = document.createElement('ul');
const LoggedIn = localStorage.getItem('profile');

const receiveBtn = document.querySelector('.receive-btn') as HTMLButtonElement;
const emailResetInput = document.querySelector('#email-reset') as HTMLInputElement;
const resetForm = document.querySelector('.reset-form') as HTMLFormElement;

const verifyResetBtn = document.querySelector('.submit-verify-reset-btn') as HTMLButtonElement
const verifyResetForm = document.querySelector('.verify-reset-form') as HTMLFormElement;
const verifyResetInput = document.querySelector('#verify-reset-token') as HTMLInputElement;

const resetPasswordForm = document.querySelector('.reset-password') as HTMLFormElement;
const resetPasswordBtn = document.querySelector('.reset-password-btn') as HTMLButtonElement;
const newPasswordInput = document.querySelector('#new-password') as HTMLInputElement
const confirmPasswordInput = document.querySelector('#confirm-password') as HTMLInputElement

const forgotPasswordBtn = document.querySelector('.forgot') as HTMLParagraphElement

if(LoggedIn){
    window.location.href = 'https://client-dun-pi.vercel.app/filesPage.html'
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

interface Err {
    type: string;
    value: string;
    msg: string;
    path: string;
    location: string;
  }

const registerFunc = async(user:User) =>{
    
    const response = await fetch('https://file-server-main.vercel.app/auth/signup',{
        method: 'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify(user)
    })
    return response;
}


const verifyFunc = async(token:string) =>{
    const response = await fetch(`https://file-server-main.vercel.app/verify-email/${token}`,{
        method: 'POST',
        headers:{
            'Content-type':'application/json'
        }
    })
    return response;
}

const loginFunc = async(cred:Credentials)=>{
    const response = await fetch(`https://file-server-main.vercel.app/auth/login`,{
        method: 'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify(cred)
    })
    return response
}

const receiveResetTokenFunc = async(email:string) =>{
    
    const response = await fetch('https://file-server-main.vercel.app/auth/reset-token',{
        method: 'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({email:email})
    })
    const data = await response.json();
    return data
}



const resetPasswordFunc = async(password:string,id:string) => {
    const response = await fetch(`https://file-server-main.vercel.app/auth/reset-password/${id}`,{
        method: 'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({password:password})
    })
    const data = await response.json();
    return data
}


function errorDisplay(errArray:Err[]){
    const errorList = errArray.map((error) => {
        return `
          <li>
            <i class="fas fa-times-circle"></i>
            <p>${error.msg}</p>
          </li>
        `;
      }).join('');
    return errorList;
}










const getUser = async(id:string) =>{
    const response = await fetch(`https://file-server-main.vercel.app/user/${id}`,{
        method:'GET',
        headers:{
            'Content-type':'application/json'
        }
    })

    const data = await response.json();
    return data;
}
















registerBtn.addEventListener('click',async(e)=>{
    e.preventDefault()
    const user:User = {
        name  : usernameInput.value,
        email: emailInput.value,
        password: passwordInput.value
    }
    const response = await registerFunc(user);
    const data = await response.json();
    if(data.success){
        registerDiv.classList.add('hide');
        verifyForm.classList.remove('hide');
    }else{
        const errorList = document.createElement('ul'); // create a new <ul> element
        errorList.innerHTML = errorDisplay(data.errors);
        const secondChild = registerDiv.children[1];  // set the innerHTML of the <ul> element to the HTML code generated by errorDisplay
        registerDiv.insertBefore(errorList,secondChild);
    }
})

interface Info{
    user:Object,
    token:string
}
loginBtn.addEventListener('click',async(e)=>{
    e.preventDefault()    
    const cred:Credentials = {
        email: emailLogInput.value,
        password: passwordLogInput.value
    }
    const response = await loginFunc(cred)
    const data = await response.json();
    if(data.success){
        const user = await getUser(data.id)
        const info = {user:user,token:data.token}
        const infoString = JSON.stringify(info);
        localStorage.setItem('profile', infoString);
        window.location.href = 'https://client-dun-pi.vercel.app/filesPage.html'
    }else{
         // create a new <ul> element
        errorList.innerHTML = errorDisplay(data.errors);
        const secondChild = loginDiv.children[1];  // set the innerHTML of the <ul> element to the HTML code generated by errorDisplay
        loginDiv.insertBefore(errorList,secondChild);
    }
})

receiveBtn.addEventListener('click',async(e)=>{
    e.preventDefault();
    const email = emailResetInput.value
    const data = await receiveResetTokenFunc(email);
    if(data.success){
        registerDiv.classList.add('hide');
        loginDiv.classList.add('hide');
        verifyForm.classList.add('hide');
        resetForm.classList.add('hide');
        verifyResetForm.classList.remove('hide')
    }
})

verifyBtn.addEventListener('click',async(e)=>{
    e.preventDefault()

    const token = verifyInput.value;
    const response = await verifyFunc(token);

    const{success} = await response.json();

    if(success){
        verifyForm.classList.add('hide')
        loginDiv.classList.remove('hide')
    }
});
let resetId:string;
verifyResetBtn.addEventListener('click',async(e)=>{
    e.preventDefault()

    const token = verifyResetInput.value;
    const response = await verifyFunc(token);

    const{success,id} = await response.json();
    

    if(success){
        resetId=id;
        verifyForm.classList.add('hide');
        loginDiv.classList.add('hide');
        registerDiv.classList.add('hide');
        resetPasswordForm.classList.remove('hide');
        verifyResetForm.classList.add('hide')
    }
});

alreadyLoginBtn.addEventListener('click',()=>{
    registerDiv.classList.add('hide');
    loginDiv.classList.remove('hide')
})
alreadyRegBtn.addEventListener('click',()=>{
    registerDiv.classList.remove('hide');
    loginDiv.classList.add('hide');
})




resetPasswordBtn.addEventListener('click',async(e)=>{
    e.preventDefault()
    const password = newPasswordInput.value
    const {success} = await resetPasswordFunc(password,resetId);

    if(success){
        verifyForm.classList.add('hide');
        loginDiv.classList.remove('hide');
        registerDiv.classList.add('hide');
        resetPasswordForm.classList.add('hide');
        resetForm.classList.add('hide');
    }
})

forgotPasswordBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    verifyForm.classList.add('hide');
    resetForm.classList.remove('hide')
    loginDiv.classList.add('hide');
    registerDiv.classList.add('hide');
    resetPasswordForm.classList.add('hide');
})

confirmPasswordInput.addEventListener('input',(e)=>{
    const newPassword = newPasswordInput.value
    const input = e.target as HTMLInputElement;
    
    if(newPassword === input.value){
        resetPasswordBtn.disabled = false;
    }
})