
var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const axios = require('axios');
const qs = require('query-string');

var pgp = require('pg-promise')();

const dev_dbConfig = {
	host: 'db',
	port: 5432,
	database: process.env.POSTGRES_DB,
	user:  process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD
};

const isProduction = process.env.NODE_ENV === 'production';
const dbConfig = isProduction ? process.env.DATABASE_URL : dev_dbConfig;


if (isProduction) {
  pgp.pg.defaults.ssl = {rejectUnauthorized: false};
}

const db = pgp(dbConfig);


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/'));

app.get('/main', function(req,res){
	res.render('pages/main',{
		my_title:"Main Page",
		artist: '',
		error: false,
		search:false,
		image:'',
		review:'',
		imageLink:'',
		bandName:'-',
		link:'#',
		year:'-',
		genre:'-',
		bio:'',
		fM:'',
	});
});

app.get('/searches', function(req,res){
	var call = `SELECT * FROM searches;`;
	db.task('get-everything', task=>{
		return task.batch([
			task.any(call)
		]);
	}).then(info => {
		res.render('pages/searches.ejs',{
			my_title:"Search Page",
			data : info
		})
	}).catch(error=>{
		request.flash('error', err);
		res.render('pages/searches.ejs',{
			my_title:"Search Page",
			data : ''
		})
	});
});

app.post('/search',function(req,res){
	var artist = req.body.artist;
	if(artist){
		axios({
			url: `https://theaudiodb.com/api/v1/json/2/search.php?s=${artist}`,
			  method: 'GET',
			  dataType:'json',
			})
			.then(items =>{
				res.render('pages/main',{
					my_title:"Main Page",
					error:false,
					search:true,
					imageLink: items.data.artists[0].strArtistBanner,
					bandName: items.data.artists[0].strArtist,
					link: "https://"+items.data.artists[0].strFacebook,
					year: items.data.artists[0].intFormedYear,
					genre: items.data.artists[0].strGenre,
					bio: items.data.artists[0].strBiographyEN,
					fM: items.data.artists[0].strLastFMChart
				})
			})
			.catch(error =>{
				console.log(error);
				res.render('pages/main',{
					my_title:"Main Page",
					error:false,
					search:false,
					imageLink:'',
					bandName:'-',
					link:'',
					year:'-',
					genre:'-',
					bio:'',
					fM:'',
				})
			});
	}
	else{
		res.render('pages/main',{
			my_title:"Main Page",
			error:false,
			search:false,
			imageLink:'',
			bandName:'-',
			link:'',
			year:'-',
			genre:'-',
			bio:'',
			fM:'',
		});
	}
});

app.get('/search',function(req,res){
	var artist = req.body.artist;
	if(artist){
		db.any()
        .then(info => {
        })
        .catch(err => {
            console.log(err);
        })
	}
});

app.post('/addsearch',function(req,res){
	var name = req.body.band;

	var link = req.body.link;

	var year = req.body.year;

	var genre = req.body.genre;

	var fM = req.body.fM;


	var insert = `INSERT INTO searches(artistName,artistFB,formationYear,artistGenre,artistBio) VALUES('${name}','${link}','${year}','${genre}','${fM}');`;
	db.task('get-everything', task=>{
		return task.batch([
			task.any(insert),
		]);
	}).then(info => {
		res.render('pages/main',{
			my_title:"Main Page",
			error:false,
			search:false,
			imageLink:'',
			bandName:'-',
			link:'#',
			year:'-',
			genre:'-',
			bio:'',
			fM:'',
			data:'',
		})
	}).catch(error=>{
		console.log(error);
			res.render('pages/main',{
				my_title:"Main Page",
				error:true,
				search:true,
				imageLink:'',
				bandName:'-',
				link:'#',
				year:'-',
				genre:'-',
				bio:'',
				fM: '',
				data:'',
			})
	});
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});