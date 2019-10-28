const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.addAdminRole = functions.https.onCall(async(data, context)=>{
    // if unauthorized request 
     if(context.auth.token.admin != true){
        return {
            error: true,
            message : 'Unauthorized request!! status  401!! '
        }
     }
    //get user and add custome claim (admin)
   try{
        const user = await admin.auth().getUserByEmail(data.email);
        if(user.customClaims != undefined && user.customClaims.admin == true){
            return {
                error: true,
                message : `User had already been made an admin!`
            }
        }
    
        await admin.auth().setCustomUserClaims(user.uid,{admin: true});
        return {
            error: false,
            message : `Success! ${data.email} has been made an admin`
        }
   }catch(err){
       return {
          error: true,
          message : err.message
       }
   }

});