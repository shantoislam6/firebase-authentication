// add admin to cloud function addAdminRole
const addAdminForm = document.querySelector('.admin-actions');
addAdminForm.addEventListener('submit', function(e){
    e.preventDefault();
    const adminEmail = this.adminEmail.value;
    const addAdminRole = functions.httpsCallable('addAdminRole');
    addAdminRole({email: adminEmail}).then(result=>{
        console.log(result);
    })
});
// listen for auth status changes
auth.onAuthStateChanged((user)=>{

    // invoke unauthenticate ui function 
    initAndReset();
    setUpUi(user);

    // check user is not null 
    if(user){
       //get user user claims from  addAdmin cloud onCall function 
        user.getIdTokenResult().then(idTokenResult=>{
        user.admin = idTokenResult.claims.admin;
        db.collection('guides').get().then(snapshot=>{
            if(snapshot.empty){
                setupGuides('EMPTY');
            }
        });

        // get every guides when added new guides
        db.collection('guides').onSnapshot((response)=>{
            const changes = response.docChanges();
            changes.forEach(change=>{
                switch (change.type) {
                case 'added':
                setupGuides(change.doc);
                break;
            }
        });
        }, (err) => {
          console.log(err) ;
       }); 
 });
}else{
    setupGuides(null);
  }
});

   // Create Guieds 
const createGuideFrom = document.querySelector('#create-form');
createGuideFrom.addEventListener('submit', function(e){
   e.preventDefault();

    const errCont = this.parentNode.querySelector(".show-err");
    const spinner = this.querySelector('.btn-l-spinner');
    spinner.style.display = 'block';

    // add new guide to guides collection 
    db.collection("guides").add({
        title: this.title.value,
        content: this.content.value,
    })
    .then(()=>{
        errCont.innerHTML = '';
        spinner.style.display = 'none';
        const model = document.querySelector("#modal-create");
        M.Modal.getInstance(model).close();
        this.reset();
    })
    .catch(err=> {
        spinner.style.display = 'none';
        errCont.innerHTML = err.message;
    });
});


// sign-up form
const signUpForm = document.querySelector('#signup-form');
signUpForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.email.value;
    const password = this.password.value;
    const bio = this.signupbio.value;

    const errCont = this.parentNode.querySelector(".show-err");
    const spinner = this.querySelector('.btn-l-spinner');
    spinner.style.display = 'block';

    // create a new user into firebase 
    auth.createUserWithEmailAndPassword(email, password)
    .then((cred)=>{
        return db.collection('users').doc(cred.user.uid).set({
            bio: bio
        });
    })
    .then(()=>{
        spinner.style.display = 'none';
        errCont.innerHTML = '';
        //reset model
        const model = document.querySelector("#modal-signup");
        M.Modal.getInstance(model).close();
        this.reset();
    })
    .catch(err=> {
        spinner.style.display = 'none';
        errCont.innerHTML = err.message;
    });
});

// user sign out 
document.querySelector('#logout').addEventListener('click', function(e){
    e.preventDefault();
    auth.signOut().then(()=>{
        // listener for signout
    });
});

// log in user form
const loginform = document.querySelector('#login-form');
loginform.addEventListener('submit', function(e){
    e.preventDefault();
    const email = this.email.value;
    const password = this.password.value;

    const errCont = this.parentNode.querySelector(".show-err");
    const spinner = this.querySelector('.btn-l-spinner');
    spinner.style.display = 'block';

    // sing in existing user 
    auth.signInWithEmailAndPassword(email, password)
    .then((cred)=>{
        spinner.style.display = 'none';
        errCont.innerHTML = '';
        // reset model
        const model = document.querySelector("#modal-login");
        M.Modal.getInstance(model).close();
        this.reset();
    })
    .catch(err=> {
        spinner.style.display = 'none';
        errCont.innerHTML = err.message;
    });
});
