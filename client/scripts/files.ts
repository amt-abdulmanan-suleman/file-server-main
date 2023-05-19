
const LogoutBtn = document.querySelector('.logout') as HTMLButtonElement;
const postBtn = document.querySelector('.add') as HTMLButtonElement;
const closeBtn = document.querySelector('.close') as HTMLButtonElement;
const icons = document.querySelectorAll('.icon');

const initialDisplay = document.querySelector('.init');
const postFormSection = document.querySelector('.add-sec');
const fileInput = document.querySelector('#file') as HTMLInputElement;
const postFileBtn = document.querySelector('.post') as HTMLButtonElement;

const mainSection =  document.querySelector('.main')!;



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
    postFormSection?.classList.add('hide');
    initialDisplay?.classList.remove('fade');
    mainSection.classList.remove('fade');
    mainSection.classList.remove('accessibility');
})
postBtn.addEventListener('click',()=>{
    initialDisplay?.classList.add('fade');
    mainSection.classList.add('fade');
    postFormSection?.classList.remove('hide')
    mainSection.classList.add('accessibility');
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
    if(data.success){
      const file = await getFile(data.id);
      console.log(file)
      // const element = fileDisplay(file);
      // mainSection.insertAdjacentHTML('beforeend', element);
    }

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
    return data
  };
  
  const getFile = async(id:string) => {
    let info;
    if (infoString) {
      info = JSON.parse(infoString);
    }
    const response = await fetch(`http://localhost:3000/api/files/${id}`,{
      method:'GET',
      headers:{
        'Content-type':'application/json',
        Authorization:`Bearer ${info?.token}`
      }
    })

    const data =  await response.json();

    if(data.success){
      return data.file
    }
  }



/**
 * Get All Files Function
 * @returns all files in Json Format
 */

const getAllFiles = async()=>{
  let info;
    if (infoString) {
      info = JSON.parse(infoString);
    }
  const response =  await fetch('http://localhost:3000/api/files',{
      method:'GET',
      headers:{
          'Content-type':'application/json',
          Authorization: `Bearer ${info?.token}`
      }
  })
  const data = await response.json();

  return data;
}
async function getFiles(){
  const files = await getAllFiles()
  console.log(files.files)
  if(files){
    mainSection.classList.remove('hide')
    mainSection.innerHTML = fileDisplay(files.files)
  }
  
}

getFiles()


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
  
  interface File {
    created_at: string;
    description: string;
    id: number;
    mimetype: string;
    readonly name: string;
    no_of_downloads: number;
    no_of_sent: number;
    path: string;
    user_id: string;
    url: string;
  }
  

  function fileDisplay(files: File[]): string {
    if (!Array.isArray(files)) {
      return ''; // Return an empty string or handle the error appropriately
    }
    const fileElements = files.map((file) => {
      let fileContent = '';
      const filename = file.name;
      const nameWithoutExtension = filename.split("-")[1].split(".")[0];
      if (file.mimetype.startsWith('image/')) {
        fileContent = `<img width='100%' height='100%' src="${file.url}" alt="${file.name}">`;
      } else if (file.mimetype === 'application/pdf') {
        fileContent = `<iframe width='100%' height='100%' src="${file.url}" frameborder="0"></iframe>`;
      } else if (file.mimetype.startsWith('video/')) {
        fileContent = `<video width='100%' height='100%' src="${file.url}"></video>`;
      }
  
      return `
      <div class="card">
        <div class="file-container">
          ${fileContent}
        </div>
        <div class="about">
          <h4>${nameWithoutExtension}</h4>
          <p>${file.description}</p>
        </div>
        <div class="utility">
          <div class="send-container">
            <div class="send">
              <label for="email">
                <input type="email" name="email" id="email" placeholder="email of the recipient">
              </label>
              <i class="fas fa-paper-plane"></i>
            </div>
            <p>Number of times sent: ${file.no_of_sent}</p>
          </div>
          <div class="download-container">
            <button class="download ${file.id}" type="button">
              <i class="fas fa-download"></i>
              <p>download</p>
            </button>
            <p>Number of downloads: ${file.no_of_downloads}</p>
          </div>
        </div>
      </div>
      `;
    }).join('');
  
    return fileElements;
  }
  