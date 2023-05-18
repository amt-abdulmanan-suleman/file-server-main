
const LogoutBtn = document.querySelector('.logout') as HTMLButtonElement;
const postBtn = document.querySelector('.add') as HTMLButtonElement;
const closeBtn = document.querySelector('.close') as HTMLButtonElement;
const icons = document.querySelectorAll('.icon');

const initialDisplay = document.querySelector('.init');
const postFormSection = document.querySelector('.add-sec');
const fileInput = document.querySelector('#file') as HTMLInputElement;
const postFileBtn = document.querySelector('.post') as HTMLButtonElement;


const infoString = localStorage.getItem('profile');
let info;
if(infoString){
    info = JSON.parse(infoString);
    const {user} = info;
    if(user.user.role=="user"){
        postBtn.classList.add('hide')
    } 
}

LogoutBtn.addEventListener('click',async(e)=>{
    e.preventDefault();
    const data = await logoutFunc();

    if(data.success){
        localStorage.removeItem('profile');
        window.location.href = 'http://127.0.0.1:5500/client/index.html';
    }else{
        console.log('error')
    }
})
icons.forEach((icon)=>{
    icon.addEventListener('click',()=>{
        fileInput.click()
    })
})
closeBtn.addEventListener('click',()=>{
    initialDisplay?.classList.remove('opacity');
    postFormSection?.classList.add('hide')
})
postBtn.addEventListener('click',()=>{
    initialDisplay?.classList.add('opacity');
    postFormSection?.classList.remove('hide')
})

postFileBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const form = document.querySelector('#file-form') as HTMLFormElement;
    const desc = document.querySelector('#desc') as HTMLTextAreaElement;
    const formData = new FormData(form);
    
    if (fileInput.files && fileInput.files[0]) {
      formData.set('file', fileInput.files[0]);
    }
    let info;
    let id;
    if (infoString) {
        info = JSON.parse(infoString);
      const { user } = info;
      id = user.user.id;
    }
    
    formData.append('id',id)
    formData.append('desc',desc.value)
    
    const data = await postFunc(formData);

    console.log(data)
  });
  

  const postFunc = async (formData:FormData) => {
    let info;
    if (infoString) {
      info = JSON.parse(infoString);
    }
    const response = await fetch('http://localhost:3000/api/files/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${info?.token}`,
      },
      body: formData,
    });
  
    const data = await response.json();
    return data;
  };
  


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


fileInput.addEventListener("change", (e) => {
    e.preventDefault();
    if (fileInput.files) {
      const file = fileInput.files[0];
        console.log(file)
      const reader = new FileReader();
  
      reader.addEventListener("load", () => {
        const dataUrl = reader.result as string;
        
        if (file.type.startsWith('image/')) {
          const previewElement = document.querySelector('.image') as HTMLImageElement;
          const previewDiv = document.querySelector('.preview') as HTMLDivElement;
          previewDiv.classList.add('size')
          previewElement.classList.remove('hide')
          previewElement.src = dataUrl;
        } else if (file.type.startsWith('video/')) {
          const previewDiv = document.querySelector('.preview') as HTMLDivElement;
          previewDiv.classList.add('size')
          const previewElement = document.querySelector('.video') as HTMLVideoElement;
          previewElement.classList.remove('hide')
          previewElement.src = dataUrl;
          previewElement.play()
        } else if (file.type === "application/pdf") {
          const previewDiv = document.querySelector('.preview') as HTMLDivElement;
          previewDiv.classList.add('size')
          const previewElement = document.querySelector('#pdfPreview') as HTMLIFrameElement;
          previewElement.classList.remove('hide')
          previewElement.src = dataUrl;
        }
      });
  
      // Read the contents of the selected file as a data URL
      reader.readAsDataURL(file);
    }
  });
  

  function fileDisplay(files:Err[]){
    const errorList = files.map((file) => {
        return `
          <li>
            <i class="fas fa-times-circle"></i>
            <p>${file.msg}</p>
          </li>
        `;
      }).join('');
    return errorList;
}
  
  