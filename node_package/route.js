var express = require('express');
var router = express.Router();

var crypto = require('crypto');
var random = require('csprng');
var gravatar = require('gravatar');
var busboy = require('connect-busboy');

// Modules for Mongo Db

var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/levantador';

var object_test = {

	email: "alyliberiste38@hotmail.com",
	nome: "Alidieu",
	ra: "475181",
	hashed_senha: "Alidieu",
	salt: "123"
};

var InsertDocument = function(db, object, callback){

	db.collection('users').insertOne(object, function(error, result){

		assert.equal(error, null);
		console.log("InsertDocument OK");
		console.log(result);
	});
};

//Connecting to Mondo DB


module.exports = router;


router.get('/', function(req, resp){

	resp.render('index')

});

router.get('/login', function(req, resp){

	resp.render('login');
});

router.get('/cadastro', function(req, resp){

	resp.render('cadastro_usuarios');
});

router.post('/check_login', function(req,resp){

	var email = req.body.email;
	var password = req.body.password;


	//dado recuperados e comparados do bd

	mongoClient.connect(url, function(error, db){

			assert.equal(error, null);


				var email = req.body.email;
						var password = req.body.password;

					console.log(email);

				db.collection('users').find({'email':email}, function(error, result){

					//var result = db.collection('users').find({'email':email});
					result.each(function(error, object){


				if(object.nome){

					var senha_bd = object.hashed_senha;
					var salt_bd = object.salt;

					//codificar a senha

					var new_password_do_usuario = salt_bd + password;

					var hashed_new_password_do_usuario = crypto.createHash('sha512').update(new_password_do_usuario).digest('hex');


					if(hashed_new_password_do_usuario === senha_bd){


						resp.json({"response":true, "message":"Login com sucesso"});
					}else{
						resp.json({"response":false, "message":"Senha inválida"});
					}


					//resp.render('login', {'message': 'login com sucesso!'});


				}else{
					//resp.render('cadastro_usuarios');
					resp.json({"response":false, "message":"Error no Login"});
					}
				});

			});

		});

});


router.post('/add_cadastro', function(req, resp){
	//resp.json({'status':'200', 'message': 'wllcome user'});

	var nome = req.body.nome;
	var email = req.body.email;
	var ra = req.body.ra;
	var password = req.body.password;

	//verifying if email is valid

	if(email.indexOf('@') !== (email.length - 1)){

		var ok = 'email valido';


		if((password.length > 6) && (password.match(/[0-9]/)) && (password.match(/.[!,@,#,$,%,^,&,*,?,_,~]/)) && (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/))){
			//password encryption using randomic salt string and sha512 hashed method...

		var str_random = random(160, 36);
		var new_password = str_random + password;

		var hashed_new_password = crypto.createHash('sha512').unomepdate(new_password).digest('hex');

		var new_user = {
			email: email,emai
			nome: nome,
			ra: ra,
			hashed_senha: hashed_new_password,
			salt: str_random
		};

		// Insert into DB

		mongoClient.connect(url, function(error, db){

			assert.equal(error, null);
			db.collection('users').find({'email': email}, function(error, result){


				result.each(function(error, object){

					if(object === null){

						InsertDocument(db, new_user, function(){
						db.close();
					});

					resp.render('login', {'message': 'cadastro com sucesso!'});

					}else{
						resp.json({'email':'Opa, este email já exite!'});
					}

				});


			});

		});

		//resp.json({'nome': nome, 'email': email, 'ra': ra, 'password': password, 'validade':ok});
	//resp.render('index', {'message': 'Hello Android, from nodejs Server'});
		}else{

			resp.json({'message': 'senha fraca'});
		}

	}else{
		resp.json({'message': 'emai invalido'});
	}



});

router.get('/upload-test', function(request, response){

	response.render('upload-test');

});

router.post('/upload', function(request, response){

	var path = __dirname + '/upload-file/uploads/';
	request.pipe(request.busboy);

    console.log('1')
   request.busboy.on('file', function(fieldname, file, filename) {
   console.log('2')
   var new_path = path + filename;
    var fstream = fs.createWriteStream(new_path);
    file.pipe(fstream);

    fstream.on('close', function () {
        response.json({"response":true, "message":"File sucessfully saved"});
    });

    fstream.on('error', function () {
        response.json({"response":false, "message":"Error on saving file"});
    });

   });


});

// Exibing image in the browser

router.get('/upload/:filename', function(request, response){

	var file_name = request.params.filename;
	var file_new_name  = file_name.substring(1);
	console.log(file_new_name);

	var new_path = __dirname + '/upload-file/uploads/' + file_new_name;

	var img = fs.readFileSync(new_path);

	response.writeHead(200, {'Content-Type': 'image/png'});
	response.end(img, 'binary');


});
