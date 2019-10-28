// listen for auth status changes
auth.onAuthStateChanged((user)=>{
    initAndReset();
    setUpUi(user);
    if(user){

        db.collection('guides').get().then(snapshot=>{
            if(snapshot.empty){
               setupGuides('EMPTY');
            }
        });

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

        const errCont = this.parentNode.querySelector(".show-err");
        const spinner = this.querySelector('.btn-l-spinner');
        spinner.style.display = 'block';

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

