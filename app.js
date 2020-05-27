var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose');

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body : String,
  created: {type: Date, default: Date.now  }
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//   title: "Test Blog",
//   image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
//   body: "Hello this is a blog post"
// },function(err, createdBlog ){
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(createdBlog);
//   }
// });

//RESTFUL ROUTES
app.get("/", function(req,res){
  res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function(req, res){
  Blog.find({}, function(err, blogs){
    if (err) {
      console.log(err);
    } else {
      res.render("index", {blogs: blogs});
    }
  });
});


// NEW ROUTE
app.get("/blogs/new", function(req, res){
  res.render('new');
})


app.listen(3000, function(){
  console.log("server has started on port 300");
});
