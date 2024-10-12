import express from 'express';
import { fileURLToPath } from 'url';
import path from 'node:path';
import { dirname , join } from 'path';
import { messages } from './data.mjs';


const app = express();

const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// To parse the form data into req.body
app.use(express.urlencoded({extended: true}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const assetsPath = path.join(__dirname);
app.use(express.static(assetsPath));

app.get("/", (req, res) => {
	res.render("index", {messages: messages});
});

app.get("/message/:id", (req, res)=>{
	const messageId = parseInt(req.params.id);
	const message = messages.find(msg => msg.id === messageId);

	if(message){
		res.render('message', {message});
	}
	else {
		res.status(404).send('Message not found');
	}
});

app.get("/new", (req,res) =>{
	res.render("form");
});

app.get("/handle-form", (req, res) =>{
	res.redirect("/new");
});


app.post('/new', (req,res)=>{
	const { author , msg} = req.body;
	messages.push({id:messages.length, user: author, text: msg, added: new Date()});
	res.redirect("/");
});

app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
