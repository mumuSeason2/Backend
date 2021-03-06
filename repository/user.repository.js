const model = require("../models");
// constructor

const User = function(user) {
  this.user_name = user.user_name;
  this.email = user.email;
  this.password = user.password;
  this.provider = user.provider;
  this.sns_id = user.sns_id;
  this.profile = user.profile;
};

User.create = (newUser, results) => {
  model.User.create({
    user_name : newUser.user_name,
    email : newUser.email,
    password : newUser.password
    })
    .then(result => 
      {console.log("created user: ",{ ...newUser });
      results(null,{ ...newUser })
      return;
    })
    .catch(err => 
      {results(err,null);
      console.log(err);
      return;
    });
};

User.findById = (id, results) => {
  model.User.findOne({
    raw : true,
    where : { id : id },
    attributes : ['id','email','user_name','provider']
  })
  .then(result => {
      results(null,result)
      //return;
    })
    .catch(err => 
      {results(err,null);
      console.log(err);
      //return;
    });
};


User.findIdByEmail = (email) => {
  model.User.findOne({
    raw : true,
    where : { email : email },
    attributes : ['id']
  }).then(result => {
    return result;
  }).catch(err => {
    console.log(err);
  });
};

User.findByEmail = (email, results) => {
  model.User.findOne({
    raw : true,
    where : { email : email },
    attributes : ['id','email','password','user_name','provider']
  }).then(result => {
    return results(null,result);
  }).catch(err => {
    console.log(err);
    return results(err,null);
  });
};

// User.findByEmail = (email, results) => {
//   model.User.findOne({
//     raw: true,
//     where: {email:email},
//     attributes:['id','email','user_name']
//   })
//   .then(result => 
//       {console.log("find user: ",result);
//       results(null,result)
//       return;
//     })
//     .catch(err => 
//       {results(err,null);
//       console.log(err);
//       return;
//     });
// };


User.getAll = (user_email, results) => {
  if (user_email){
    model.User.findOne({
      raw: true,
      where: {email:user_email},
      attributes:['id','email','user_name']
    })
    .then(result => 
        {console.log("find user1: ",{...result});
        results(null,result);
        return;
      })
      .catch(err => 
        {results(err,null);
        console.log(err);
        return;
      });
  }
  else{
    model.User.findAll({
      raw: true,
      attributes:['id','email','user_name']
    })
    .then(result => 
        {console.log("find user2: ",{ ...result});
        results(null,result);
        return;
      })
      .catch(err => 
        {results(err,null);
        console.log(err);
        return;
      });
  }
};

User.updateById = (id, user, results) => {
  model.User.update({
    user_email:user.user_email,
    email:user.email},
    {where:{id:id}},
    
  ).then(result => 
    {console.log("update user: ",{id:id,user_email:user.user_email,email:user.email});
    results(null,{id:id,user_email:user.user_email,email:user.email})
    return;
  })
  .catch(err => 
    {results(err,null);
    console.log(err);
    return;
  });
};

User.remove = (id, results) => {
  model.User.destroy({
    where:{id:id}
  }).then(result => 
    {
      if(result == 0) throw "already deleted"
      console.log("delete user: ",result);
      results(null,"done")
      return;
  })
  .catch(err => 
    {results(err,null);
    console.log(err);
    return;
  });
};

module.exports = User;