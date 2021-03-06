var express     = require('express'),
    app         = express(),
    expressSanitizer = require('express-sanitizer'),
    bodyParser  = require('body-parser'),
    methodOverride = require('method-override'),
    mongoose    = require('mongoose');

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

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
});

//CREATE ROUTES
app.post("/blogs", function(req, res){
  console.log(req.body.blog);
  req.body.blog.body = req.sanitize(req.body.blog.body);
  console.log("===================");;
  console.log(req.body.blog);
  Blog.create(req.body.blog, function(err, newBlog){
    if (err) {
      res.render("new");
    } else {
      res.redirect("/blogs");
    }
  });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req,res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("show", {blog:foundBlog});
    }
  });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render("edit", {blog: foundBlog});
    }
  });
});

//UPDATE ROUTES
app.put("/blogs/:id", function(req, res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if (err) {
      res.redirect("/blogs");
    }else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(err){
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

app.listen(3000, function(){
  console.log("server has started on port 300");
});
