//MYSQL CONNECTION PART FOR AUTHENTICATION
const  bcrypt     = require('bcryptjs'); 
const fs = require('fs')
const  env        = require('./env');
const basedataserverurl = env.basedataserverurl;

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: env.dbhost,
  port: env.dbport,
  user: env.dbuser,
  password: env.dbpassword,
  database: env.dbdatabase
});
module.exports = {
  storeData: function (data, path){
    try {
      fs.writeFileSync(path, JSON.stringify(data))
    } catch (err) {
      console.error(err)
    }
  },
  updateBadge: function (userid,cb){
    //prepare the json object
    return connection.query('SELECT u.*,o.logo_url FROM users u JOIN organizations o ON u.primary_organization = o.id WHERE u.id = ?',[userid], (err,userinfo) => {
      if(err) cb(err);
      return connection.query('SELECT r.* FROM users u JOIN roles r ON u.role = r.id WHERE u.id = ? UNION SELECT r.* FROM users u JOIN roles r on u.expert_role = r.id WHERE u.id = ?',[userid,userid], (err, userroles) => {
	return connection.query('SELECT * FROM user_peoples_framework_tags WHERE user_id = ?',[userid], (err,userptags) => {
	  if(err) cb(err);
	  return connection.query('SELECT u.primary,s.image_location FROM user_sustainability_goals u JOIN sustainability_goals s ON u.sustainability_goal = s.id WHERE u.user_id = ?',[userid], (err,usersgoals) => {
	    if(err) cb(err);
	    userdict = {};
	    userdict.firstname = userinfo[0].firstname;
	    userdict.lastname = userinfo[0].lastname;
	    userdict.affiliation = userinfo[0].affiliation;
	    userdict.orglogo = userinfo[0].logo_url.replace("{outstep_web_repo}",basedataserverurl); 
	    for(var i = 0; i < userroles.length; i++){
	      if(userroles[i].roletype === "regular"){
		userdict.rolelogo = userroles[i].image_location.replace("{outstep_web_repo}",basedataserverurl);
	      }
	      if(userroles[i].roletype === "expert"){
		userdict.expertlogo = userroles[i].image_location.replace("{outstep_web_repo}",basedataserverurl);
	      }
	    }

	    if(userinfo[0].expert_role === null){
	      userdict.isexpert = 0;
	      userdict.expertlogo = "";
	    }else{
	      userdict.isexpert = 1;
	    }
	    j = 1;
	    for(var i = 0; i < usersgoals.length; i++){
	      if(usersgoals[i].primary === 1){
		userdict.primarysg = usersgoals[i].image_location.replace("{outstep_web_repo}",basedataserverurl);
	      }else{
		userdict['secondarysg'+j] = usersgoals[i].image_location.replace("{outstep_web_repo}",basedataserverurl);
		j = j + 1;
	      }
	    }
	    j = 1;
	    for(var i = 0; i < userptags.length; i++){
	      if(userptags[i].primary === 1){
		userdict.peoplesprimary = userptags[i].peoples_framework_tag;
	      }else{
		userdict['peoplessecondary'+j] =userptags[i].peoples_framework_tag;
		j = j + 1;
	      }
	    }
	    var jsonFileName = './public/assets/user_badge_jsons/userspecs_'+userid+'.json';
	    var badgeFileName = './public/assets/user_badges/user_'+userid+'.png';
	    var badgeURL = '{outstep_web_repo}/user_badges/user_'+userid+'.png';
	    var defaultSGURL = basedataserverurl+'/sg_goals_logos/sustainability_goalx.png'
	    this.storeData(userdict,jsonFileName);
	    var spawn = require("child_process").spawn;
	    var process = spawn('python',['./scripts/badgemaker/badgecreater.py',jsonFileName,badgeFileName,defaultSGURL]);
	    //update the user_badges table
	    return connection.query('DELETE FROM user_badges WHERE user_id = ?',[userid], (err) => {
	      return connection.query('INSERT INTO user_badges (user_id,image_location) VALUES (?,?)',[userid,badgeURL] , (err) => {
		cb(err);
	      });
	    });
	  });
	});
      });
    });
  },
  findUserByEmail: function (email, cb) {
    return  connection.query('SELECT u.*,b.image_location FROM users u LEFT JOIN user_badges b ON u.id = b.user_id WHERE email = ?',[email], (err, row) => {
      cb(err, row)
    });
  },
  createUser: function (user, cb) {
    return  connection.query('INSERT INTO users (firstname, lastname, email, password) VALUES (?,?,?,?)',user, (err) => {
      cb(err)
    });
  },
  getOrganizations: function (cb) {
    return connection.query('SELECT * FROM organizations',(err, rows) => {
      cb(err,rows)
    });
  },
  getRoles: function (cb) {
    return connection.query('SELECT * FROM roles',(err, rows) => {
      cb(err,rows)
    });
  },
  getSdgs: function (cb) {
    return connection.query('SELECT * FROM sustainability_goals',(err, rows) => {
      cb(err,rows)
    });
  },
  getPtags: function (cb) {
    return connection.query('SELECT * FROM peoples_framework_tags',(err, rows) => {
      cb(err,rows)
    });
  },
  updateUser: function (userInfo,currentuser,cb){
    var password = "";
    //check if password needs to be changed
    if((typeof userInfo.updatePassword != "undefined") && (userInfo.updatePassword === "on")){
      //update password
      password  =  bcrypt.hashSync(userInfo.password);
    }
    var query = 'UPDATE users SET `firstname` = \"'+userInfo.firstname+'\", `lastname`= \"'+userInfo.lastname+'\",`affiliation`=\"'+userInfo.affiliation+'\", `primary_organization` = '+userInfo.organization+',`url` = \"'+userInfo.url+'\", `role` = '+userInfo.role+' '
    if((typeof userInfo.expertrole != "undefined") && (userInfo.expertrole != "")){
      query = query + ',`expert_role` = '+userInfo.expertrole+' '
    }
    if(password != ""){
      query = query + ',`password` = \"'+password+'\" '
    }
    query = query + ' WHERE id = '+currentuser.id
    return connection.query(query,(err) => {
      if(err) cb(err);
      return connection.query('DELETE FROM `user_sustainability_goals` WHERE `user_id` = ?',currentuser.id, (err) =>{
	if(err) cb(err);
	query = 'INSERT INTO `user_sustainability_goals` (`user_id`,`sustainability_goal`,`primary`) VALUES ('
	query = query + currentuser.id + ','+userInfo.sdgprimary+',true)'
	if((typeof userInfo.sdgsecondary != "undefined")){
	  for(var i = 0; i < userInfo.sdgsecondary.length; i++){
	    query = query + ', ('+currentuser.id + ','+userInfo.sdgsecondary[i]+',false)'
	  }
	}
	return connection.query(query, (err) =>{
	  if(err) cb(err);
	  return connection.query('DELETE FROM `user_peoples_framework_tags` WHERE `user_id` = ?',currentuser.id, (err) =>{
	    if(err) cb(err);
	    query = 'INSERT INTO `user_peoples_framework_tags` (`user_id`,`peoples_framework_tag`,`primary`) VALUES ('
	    query = query + currentuser.id + ','+userInfo.ptagprimary+',true)'
	    if((typeof userInfo.ptagsecondary != "undefined")){
	      for(var i = 0; i < userInfo.ptagsecondary.length; i++){
		query = query + ', ('+currentuser.id + ','+userInfo.ptagsecondary[i]+',false)'
	      }
	    }
	    return connection.query(query, (err) =>{
	      if(err) cb(err);
	      //update badge
	      if((typeof userInfo.updateBadge != "undefined") && (userInfo.updateBadge === "on")){
		//create json file
		return this.updateBadge(currentuser.id, (err) =>{
		  if(err) cb(err);
		  else cb(false);
		});
	      }else{
		cb(false);
	      }
	    });
	  });
	});
      });
    });
  },
  getUsers: function (cb){
    query = "select c.*, b.image_location FROM user_badges b join (select a.firstname,a.lastname, a.affiliation, a.id, a.email, a.organization, r.name as role from roles r JOIN (select u.id,u.firstname,u.lastname,u.role,u.affiliation,u.email,o.name as organization from users u JOIN organizations o ON u.primary_organization = o.id) as a ON r.id = a.role WHERE r.roletype = 'regular') as c ON c.id = b.user_id"; 
    return connection.query(query,(err,users) =>{
      if(err) cb(err);
      for(let i = 0; i < users.length; i++){
	users[i].image_location =  users[i].image_location.replace("{outstep_web_repo}",basedataserverurl); 
      }
      cb(err,users);
    });
  },
  getUserInterests: function (currentuser,cb){
    return connection.query('SELECT * FROM user_peoples_framework_tags WHERE user_id = ?',[currentuser.id], (err,userptags) => {
      if(err) cb(err);
      return connection.query('SELECT * FROM user_sustainability_goals WHERE user_id = ?',[currentuser.id], (err,usersgoals) => {
	if(err) cb(err);
	userinterests = {};
	userinterests.secondarysgs = []; 
	for(var i = 0; i < usersgoals.length; i++){
	  if(usersgoals[i].primary === 1){
	    userinterests.primarysg = usersgoals[i].sustainability_goal;
	  }else{
	    userinterests.secondarysgs.push(usersgoals[i].sustainability_goal); 
	  }
	}
	userinterests.peoplessecondary = []; 
	for(var i = 0; i < userptags.length; i++){
	  if(userptags[i].primary === 1){
	    userinterests.peoplesprimary = userptags[i].peoples_framework_tag;
	  }else{
	    userinterests.peoplessecondary.push(userptags[i].peoples_framework_tag);
	  }
	}
	cb(err,userinterests);
      });
    });
  }
}
