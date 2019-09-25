// set up imports
const  express    = require('express');
const  bodyParser = require('body-parser');
const  jwt        = require('jsonwebtoken');
const  bcrypt     = require('bcryptjs'); 
const  db         = require('./db');

//helper functions
const resetUser = function (res,message) {
  authenticated = 0;
  accesstoken = '';
  currentuser = null;
  baduser = 0;
  badgeurl = env.basedataserverurl+'/user_badges/default.png';
  res.render('pages/index',{'baduser': baduser, 'authenticated': authenticated, 'user': currentuser,  'badgeurl':badgeurl,'accesstoken':accesstoken,'message':message})
}

const createUpdateForm =function (req,res,messages) {
  db.getOrganizations((err,organizations)=>{
    if(err) res.status(500).send("Server error!");
    db.getRoles((err,roles)=>{
      if(err) res.status(500).send("Server error!");
      db.getSdgs((err,sdgs)=>{
	if(err) res.status(500).send("Server error!");
	db.getPtags((err,ptags)=>{
	  if(err) res.status(500).send("Server error!");
	  db.getUserInterests(currentuser,(err,userinterests)=>{
	    if(err) res.status(500).send("Server error!");
	    res.render('pages/update',{'baduser':baduser,'authenticated':authenticated,'user':currentuser,'userinterests':userinterests,'badgeurl':badgeurl,'accesstoken':accesstoken,'organizations':organizations,'roles':roles,'sdgs':sdgs,'ptags':ptags,'messages':messages})
	  });
	});
      });
    });
  });
}
// read in evnvironmental variables
const  env        = require('./env');

const SECRET_KEY = env.secretkey;
const basedataserverurl = env.basedataserverurl;

// initialize state variables
var authenticated = 0;
var baduser = 0;
var currentuser = null;
var accesstoken = '';
var badgeurl = basedataserverurl+'/user_badges/default.png';

// set up the main router
const  router  =  express.Router();
router.use(bodyParser.urlencoded({ extended:  false }));
router.use(bodyParser.json());
module.exports = router;

// routes allowed without verification
// both GET and POST requests are allowed for the home page
router.all('/', (req, res) => {
  res.render('pages/index',{'baduser':baduser,'authenticated':authenticated,'user':currentuser,'badgeurl':badgeurl,'accesstoken':accesstoken})
});

router.post('/register', (req, res) => {
  const  firstname =  req.body.firstname;
  const  lastname  =  req.body.lastname;
  const  email     =  req.body.email;
  const  password  =  bcrypt.hashSync(req.body.password);

  db.createUser([firstname, lastname, email, password], (err)=>{
    if(err) return  res.status(500).send("Server error!");
    db.findUserByEmail(email, (err, user)=>{
      if (err) return  res.status(500).send('Server error!');
      currentuser = user
      const  expiresIn  =  24  *  60  *  60;
      accesstoken  =  jwt.sign({ id:  user.id }, SECRET_KEY, {
	expiresIn:  expiresIn
      });
      var message = 'Account created for '+email+'. Please use the menu on the right hand corner to log in.';
      resetUser(res,message);
    });
  });
});

router.post('/login', (req, res) => {
  const  email  =  req.body.email;
  const  password  =  req.body.password;
  db.findUserByEmail(email, (err, user)=>{
    if (err) return  res.status(500).send('Server error!');
    if (!user || user.length == 0) {
      baduser = 1;
      res.render('pages/index',{'baduser': baduser, 'authenticated': authenticated, 'user': currentuser, 'badgeurl':badgeurl,'accesstoken':accesstoken})
      return;
    }
    const result  =  bcrypt.compareSync(password, user[0].password);
    if(!result){
      baduser = 1;
      res.render('pages/index',{'baduser': baduser, 'authenticated': authenticated, 'user': currentuser, 'badgeurl':badgeurl,'accesstoken':accesstoken})
      return;
    }
    const  expiresIn  =  24  *  60  *  60;
    accesstoken  =  jwt.sign({ id:  user[0].id }, SECRET_KEY, {
      expiresIn:  expiresIn
    });
    baduser = 0;
    authenticated = 1;
    currentuser = user[0];
    if (currentuser.image_location !== null){
      badgeurl = currentuser.image_location.replace("{outstep_web_repo}",basedataserverurl)
    }
    res.render('pages/index',{'baduser': baduser, 'authenticated': authenticated, 'user': currentuser, 'badgeurl':badgeurl, 'accesstoken':accesstoken})
  });
});

router.get('/about',(req,res) => {
  res.render('pages/about',{'baduser': baduser, 'authenticated': authenticated, 'user': currentuser,  'badgeurl':badgeurl,'accesstoken':accesstoken})
});

// entry route for authentication
router.post('*', (req, res, next) => {
  if (req.body.accesstoken) {
    console.log(req.body);
    jwt.verify(req.body.accesstoken,SECRET_KEY,function(err,decoded){
      if(err){
	return res.status(401).json({ message: 'Unauthorized user!' });
	throw err;
      }
      next()
    });
  } else {
    var message = 'Unauthorized user!';
    resetUser(res,message);
  }
});

router.post('/logout', (req, res) => {
  var message = 'Logged out.';
  resetUser(res,message);
});

router.post('/update', (req, res) => {
  messages = {};
  createUpdateForm(req,res,messages);
});

router.post('/postupdate', (req,res) => {
  var messages = {};
  //TODO - Add form validation here
  var isValid = true; 
  if(!isValid){
    createUpdateForm(req,res,messages);
  }else{
    db.updateUser(req.body, currentuser, (err) => {
      if(err){
	var message = 'Error updating user information';
	res.render('pages/index',{'baduser':baduser,'authenticated':authenticated,'user':currentuser,'badgeurl':badgeurl,'accesstoken':accesstoken,'message':message});
      }

      var message = 'Updated successfully. Log back in to see the changes.';
      resetUser(res,message);
    });
  }
});

router.post('/map',(req,res) => {
  res.render('pages/map',{'baduser': baduser, 'authenticated': authenticated, 'user': currentuser,  'badgeurl':badgeurl,'accesstoken':accesstoken})
});

router.post('/users',(req,res) => {
  db.getUsers((err, users)=>{
    if(err) res.status(500).send('Error getting data for users.') 
    res.render('pages/users',{'baduser': baduser, 'authenticated': authenticated, 'user': currentuser,  'badgeurl':badgeurl,'accesstoken':accesstoken,'users':users});
  });
});

router.post('/globe',(req,res) => {
  res.render('pages/globe',{'baduser': baduser, 'authenticated': authenticated, 'user': currentuser,  'badgeurl':badgeurl,'accesstoken':accesstoken})
});
