var mongoose=require('mongoose');



var UserSchema=new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    gender:String,
    address:String




});
module.exports=mongoose.model("User",UserSchema)


// module.exports=mongoose.model('User',{
//     username:String,
//     password:String,
//     email:String,
//     gender:String,
//     address:String
// });