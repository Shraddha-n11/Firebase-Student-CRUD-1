var cl=console.log;

const form=document.getElementById("form");
const spinner=document.getElementById("spinner");
const book=document.getElementById("book");
const Author=document.getElementById("Author");
const rating=document.getElementById("rating");
const SubmitBtn=document.getElementById("SubmitBtn");
const UpdateBtn=document.getElementById("UpdateBtn");
const data=document.getElementById("data");


const BASE_URL="https://xhr-1st-crud-default-rtdb.firebaseio.com"
const book_URL=`${BASE_URL}/book.json`;

let bookarr=[];

//toggle
function Ontoggle(){
    spinner.classList.toggle("d-none")
}

//SnackBar
// function SnackBar(msg,icon){
//     Swal.fire({
//         Title:msg,
//         timer:2000,
//         icon:icon
//     })
// }

//Templating

function Templating(eve,i) {
    let result = ``;
    eve.forEach((ele, i) => {
        result += `
            <tr id="${ele.id}">
                <td>${i+1}</td>
                <td>${ele.title}</td>
                <td>${ele.author}</td>
                <td>${ele.rating}</td>
                <td><i onclick="OnEdit(this)"class="fa-solid fa-pen-to-square fa-2x text-primary"></i></td>
                <td><i onclick="OnDelete(this)"class ="fa-solid fa-trash-can fa-2x text-danger"></i></td>
            </tr>`;
    });
    data.innerHTML = result;
}

//Read

function OnRead(eve){
    let xhr=new XMLHttpRequest();
    xhr.open("GET", `${BASE_URL}/book.json`)
    Ontoggle();
    xhr.send(null);
    xhr.onload=function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res=JSON.parse(xhr.response)
            bookarr=[];
            for (const key in res){
                res[key].id=key;
                bookarr.push(res[key])
            }
            Templating(bookarr);
        }else{
            cl("error")
        }
        Ontoggle();
    }
}
OnRead(bookarr);

//Create

function Createtodo(ele){
    ele.preventDefault();
    let obj={
        title:book.value.trim(),
        author:Author.value.trim(),
        rating:rating.value.trim()
    }
    let xhr=new XMLHttpRequest()
    xhr.open("POST",`${book_URL}`)
    Ontoggle();
    xhr.send(JSON.stringify(obj));
    xhr.onload=function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response);
            obj.id=res.name;
            let tr=document.createElement("tr")
            tr.id=res.name;
            cl(res);
            form.reset();
            Swal.fire({
                title: "Created!",
                text: "Subject created successfully.",
                icon: "success"
            })
            OnRead();
        } else {
            cl("Error");
        }
        Ontoggle();
    };
}


//Delete

function OnDelete(eve) {
    let Remove_Id=eve.closest("tr").id;
    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed){
    let xhr=new XMLHttpRequest();
    xhr.open("DELETE", `${BASE_URL}/book/${Remove_Id}.json`)
    Ontoggle();
    xhr.send(null);
    xhr.onload=function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            eve.closest("tr").remove();
            let td=[...document.querySelectorAll("#data tr td:first-child")]
            td.forEach((eve, i)=>{
                eve.innerHTML=i+1;
            })
    }else{
        cl("error")
    }
    Ontoggle();
}
  }
})
}

// Edit

function OnEdit(eve){
    let Edit_Id = eve.closest("tr").id;
    localStorage.setItem("Edit_Id",Edit_Id)
    let xhr= new XMLHttpRequest();
    xhr.open("GET", `${BASE_URL}/book/${Edit_Id}.json`);
    xhr.send(null);
    xhr.onload=function(){
        if(xhr.status >= 200 && xhr.status <=299){
    let res= JSON.parse(xhr.response)
    cl(res)
    book.value=res.title;
    Author.value=res.author;
    rating.value=res.rating;
    SubmitBtn.classList.add("d-none");
    UpdateBtn.classList.remove("d-none")
        }else{
            cl("error")
    }

}
}

//Update

function Onupdate(eve){
    let Update_Id=localStorage.getItem("Edit_Id")
    let Upobj={
        title:book.value,
        author:Author.value,
        rating:rating.value,
    }
    let xhr= new XMLHttpRequest();
    xhr.open("PATCH",`${BASE_URL}/book/${Update_Id}.json`);
         Ontoggle();
        xhr.send(JSON.stringify(Upobj));
        xhr.onload= function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res= JSON.parse(xhr.response);
            let td=document.getElementById(Update_Id).children;
            td[1].innerHTML=Upobj.title,
            td[2].innerHTML=Upobj.author,
            td[3].innerHTML=Upobj.rating,
            SubmitBtn.classList.remove("d-none");
            UpdateBtn.classList.add("d-none");
            localStorage.removeItem("Edit_Id")
            form.reset();
            Swal.fire({
                title: "Updated!",
                text: "Subject updated successfully.",
                icon: "success"
            })
        }else{
            cl("error")
        }
        Ontoggle();
}
}





//Event Listners

form.addEventListener("submit", Createtodo);
UpdateBtn.addEventListener("click", Onupdate);