// listen for auth status changes
auth.onAuthStateChanged((user)=>{
    initAndReset(user);
    setUpUi(user);
   
    if(user){
        // show guides
        db.collection('guides').onSnapshot((response)=>{
            const changes = response.docChanges();
            changes.forEach(change=>{
                switch (change.type) {
                    case 'added':
                        setupGuides(change.doc);
                        break;
                    default:
                        break;
                }
            });
        }, err => console.log(err) );

    // Create Guieds 
    const createGuideFrom = document.querySelector('#create-form');
    createGuideFrom.addEventListener('submit', function(e){
        e.preventDefault();
        db.collection("guides").add({
            title: this.title.value,
            content: this.content.value,
        }).then(()=>{
            const model = document.querySelector("#modal-create");
            M.Modal.getInstance(model).close();
            this.reset();
        }).catch(err=> console.log(err.message));
    });
        
    }else{
        setupGuides(null);
    }
});

// sign-up form
const signUpForm = document.querySelector('#signup-form');
signUpForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.email.value;
    const password = this.password.value;
    // create a new user into firebase 
    auth.createUserWithEmailAndPassword(email, password).then((cred)=>{
        //reset model
        const model = document.querySelector("#modal-signup");
        M.Modal.getInstance(model).close();
        this.reset();
    })  
    .catch(err => console.log(err.message) );
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
    auth.signInWithEmailAndPassword(email, password).then((cred)=>{
        // reset model
        const model = document.querySelector("#modal-login");
        M.Modal.getInstance(model).close();
        this.reset();
    })
    .catch(err => console.log(err.message))
});

