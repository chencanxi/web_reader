var koa = require('koa');
var controller = require('koa-route');
var app = koa();

var views = require('co-views');
var render = views('./view',{
	map: {html: 'ejs'}
});
var koa_static = require('koa-static-server');
var ser = require('./service/webAppService.js');

app.use(koa_static({
	rootDir: './static/',
	rootPath: '/static/',
	maxage: 0
}));

app.use(controller.get('/ajax/chapter', function*(){
    this.set('Cache-Control', 'no-cache');
    this.body = ser.get_chapter_data();
}));

app.use(controller.get('/ajax/chapter_data', function*(){
    this.set('Cache-Control', 'no-cache');
    var params = querystring.parse(this.req._parsedUrl.query);
    var id = params.id;
    if(!id){
       id = "";
    }
    this.body = ser.get_chapter_content_data(id);
}));

app.use(controller.get('/route_test',function*(){
    this.set('Cache-Control','no-cache');
    this.body = 'hello world'; 
}));

app.use(controller.get('/ejs_test',function*(){
    this.set('Cache-Control','no-cache');
    this.body = yield render('test',{title:'title_test'});
}));



// 页面数据
app.use(controller.get('/',function*(){
    this.set('Cache-Control','no-cache');
    this.body = yield render('index',{title:'首页'});
}));

app.use(controller.get('/male',function*(){
    this.set('Cache-Control','no-cache');
    this.body = yield render('male',{title:'男生频道'});
}));

app.use(controller.get('/female',function*(){
    this.set('Cache-Control','no-cache');
    this.body = yield render('female',{title:'女生频道'});
}));

app.use(controller.get('/category',function*(){
    this.set('Cache-Control','no-cache');
    this.body = yield render('category',{title:'分类'});
}));

app.use(controller.get('/rank',function*(){
    this.set('Cache-Control','no-cache');
    this.body = yield render('rank',{title:'书架'});
}));

app.use(controller.get('/search',function*(){
    this.set('Cache-Control','no-cache');
    this.body = yield render('search',{title:'搜索'});
}));

app.use(controller.get('/reader',function*(){
    this.set('Cache-Control','no-cache');
    this.body = yield render('reader');
}));


var querystring = require('querystring');
app.use(controller.get('/book',function*(){
    this.set('Cache-Control','no-cache');
    var params = querystring.parse(this.req._parsedUrl.query);
    var bookId = params.id;
    this.body = yield render('book',{nav:'书籍详情',bookId:bookId});
}));

app.use(controller.get('/api_test',function*(){
    this.set('Cache-Control','no-cache');
    this.body = ser.get_test_data();
}));

app.use(controller.get('/ajax/index',function*(){
    this.set('Cache-Control','no-cache');
    this.body = ser.get_index_data();
}));

app.use(controller.get('/ajax/rank',function*(){
    this.set('Cache-Control','no-cache');
    this.body = ser.get_rank_data();
}));

app.use(controller.get('/ajax/bookbacket',function*(){
    this.set('Cache-Control','no-cache');
    this.body = ser.get_bookbacket_data();
}));

app.use(controller.get('/ajax/category',function*(){
    this.set('Cache-Control','no-cache');
    this.body = ser.get_category_data();
}));


var querystring = require('querystring');
app.use(controller.get('/ajax/book',function*(){
    this.set('Cache-Control','no-cache');
    var params = querystring.parse(this.req._parsedUrl.query);
    var id = params.id;
    if(!id){
    	id='';
    }
    this.body = ser.get_book_data(id);
}));


app.use(controller.get('/ajax/female',function*(){
    this.set('Cache-Control','no-cache');
    this.body = ser.get_female_data();
}));

app.use(controller.get('/ajax/male',function*(){
    this.set('Cache-Control','no-cache');
    this.body = ser.get_male_data();
}));


app.use(controller.get('/ajax/search',function*(){
    this.set('Cache-Control','no-cache');
    
    var params = querystring.parse(this.req._parsedUrl.query);
    var start = params.start;
    var end = params.end;
    var keyword = params.keyword;

    this.body = yield ser.get_search_data(start,end,keyword);
}));

app.listen(3000);
console.log('koa is start');