// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});

// get guides container
const guides = document.querySelector('.guides');
// get all links
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const acoundDetails = document.querySelector('.account-details');

// Setup ui based on login and logout
 function setUpUi(user){
  if(user){
   
    db.collection('users').doc(user.uid).get().then(doc=>{
      const userData = doc.data();
      let html = `
         <p>Logged in as ${user.email}</p>
         <p>Logged in as ${userData.bio}</p>
      `;
         // show account details 
        acoundDetails.innerHTML = html;
    });

    loggedInLinks.forEach(el=>{
      el.style.display = 'block'
    });
    loggedOutLinks.forEach(el=>{
      el.style.display = 'none'
    });
  }else{
    loggedInLinks.forEach(el=>{
      el.style.display = 'none';
    });
    loggedOutLinks.forEach(el=>{
      el.style.display = 'block';
    });
    acoundDetails.innerHTML = 'You are Unauthorized';
  }
}

 function setupGuides(doc){
  if(doc){
    if(doc === 'EMPTY'){
      guides.innerHTML = `<div> <h3 class="center"> No Guides Yet!! </h3> </div>`
    }else{
      const data = doc.data();
      guides.innerHTML += ` <li>
          <div class="collapsible-header grey lighten-4">${data.title}</div>
          <div class="collapsible-body white"><span>${data.content}</span></div>
        </li>`;
      }
  }else{
    guides.innerHTML = '<h4 class="center-align grey-text" style="margin-top:200px">Login to view guides </h4>'
  }
 
}

//init and restore and reset
function initAndReset(bol){
  //reset the guide container
    guides.innerHTML = ``;
  
}
