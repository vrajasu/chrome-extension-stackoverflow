//using a combination of jQuery and JS to extract imporatant user information about user interactions on StackOverFlow

//load the extension only on StackOverFlow Pages, this is managed by permissions inside the manifest file.

chrome.runtime.sendMessage({todo:"showPageAction"});


var totalScroll= 0 ;
var lastScroll= 0 ;
var post_tags =document.getElementsByClassName('post-taglist');
var tagsArray=[];

//Tags are associated with every post on StackOverFlow, and assuming that the question asker does justice to the correctly tagging topics then
//tags are a very good way of determing user behaviour or programming practices over sessions.

if(post_tags.length>0)
{
	var children = post_tags[0].children;
	var length=children.length;
	for(i=0;i<length;i++)
	{
		tagsArray.push(children[i].text);
	}
}

//Getting the question from the question page.
var question_name = $('h1 a').text();
var search_term = $('input.textbox').val();


var username=null;

//getting username from session to know for which users we have to log data.
$.ajax({
    url : "http://127.0.0.1:8080/api/current_user_remote",
    type : "get",
    async: false,
    success : function(data) {
    	username=data; 
    },
    error: function() {
       
    }
 });
console.log(username);

var scrollCaptured = false;


//checking the scroll value. Scrolling also tells us about the users behaviour
$(window).scroll(function(){
	var scrollPos = $(document).scrollTop();
	totalScroll = totalScroll + Math.abs(scrollPos-lastScroll);
	lastScroll = scrollPos;
	console.log(totalScroll);
	if ($(this).scrollTop() >= 500 && !scrollCaptured) 
	{
	   var url=document.URL;
	   if (url.includes('search'))
	   {
	   	var reqObject = {
		action:'scroll_event_search',
		parameters:{
			search_term:search_term || '',
			username:username,
			timestamp:new Date().toLocaleString()
		}
		}
		a=null;

		while(!a){
		a=prepareRequest(reqObject);
		}
	   		
	   }
	   else if(url.includes('question')){
	   		var reqObject = {
				action:'scroll_event_question',
				parameters:{
					question_name:question_name || '',
					tags:tagsArray,
					username:username,
					timestamp:new Date().toLocaleString()
				}
			}
			a=null;

			while(!a){
			a=prepareRequest(reqObject);
			}	
	   }


	   scrollCaptured=true;
	}
});          

//differnt click actions

$('a.post-tag').click(function(event){
	var tag = event.currentTarget.text;	
	var reqObject = {
		action:'tag_clicked',
		parameters:{
			tag_name:tag,
			username:username,
			timestamp:new Date().toLocaleString()
		}
	}

	a=null;

	while(!a){
	a=prepareRequest(reqObject);
	}

});
$('a.vote-down-off').click(function(event){
	var reqObject = {
		action:'vote_clicked',
		parameters:{
			vote_type:'down',
			tags:tagsArray,
			question_name:question_name || '',
			username:username,
			timestamp:new Date().toLocaleString()
		}
	}
	a=null;

	while(!a){
	a=prepareRequest(reqObject);
	}
	
});
$('a.vote-up-off').click(function(event){
	var reqObject = {
		action:'vote_clicked',
		parameters:{
			vote_type:'up',
			tags:tagsArray,
			question_name:question_name || '',
			username:username,
			timestamp:new Date().toLocaleString()
		}
	}
	a=null;

	while(!a){
	a=prepareRequest(reqObject);
	}	
});
$('a.star-off').click(function(event){
	var reqObject = {
		action:'vote_clicked',
		parameters:{
			vote_type:'star',
			tags:tagsArray,
			question_name:question_name || '',
			username:username,
			timestamp:new Date().toLocaleString()
		}
	}
	a=null;

	while(!a){
	a=prepareRequest(reqObject);
	}
});


$('a.login-link').click(function(event){
	var act= event.currentTarget.text;
	if(act === 'Log In')
	{
		var reqObject = {
			action:'auth_action',
			parameters:{
				username:username,
				auth_type:'login',
				timestamp:new Date().toLocaleString()
			}
		}
		a=null;
		while(!a){
		a=prepareRequest(reqObject);
		}

	}
	else{
		var reqObject = {
			action:'auth_action',
			parameters:{
				username:username,
				auth_type:'signup',
				timestamp:new Date().toLocaleString()
			}
		}
		a=null;
		while(!a){
		a=prepareRequest(reqObject);
		}
	}
});
$('a.btn').click(function(event){

	if(event.currentTarget.text === 'Ask Question')
	{
		var reqObject = {
			action:'ask_question',
			parameters:{
				timestamp:new Date().toLocaleString(),				
				username:username
			}
		}
		a=null;
		while(!a){
		a=prepareRequest(reqObject);
		}
	}
});
$('a.btn-outlined').click(function(event){

	if(event.currentTarget.text === 'Ask Question')
	{
		var reqObject = {
			action:'ask_question',
			parameters:{
				timestamp:new Date().toLocaleString(),				
				username:username
			}
		}
		a=null;
		while(!a){
		a=prepareRequest(reqObject);
		}
	}
});
$('body').click(function(event){

	var reqObject = {
			action:'screen_clicked',
			parameters:{
				timestamp:new Date().toLocaleString(),
				x:event.pageX,
				y:event.pageY,				
				username:username
			}
		}
		a=null;
		while(!a){
		a=prepareRequest(reqObject);
		}

});

$('a.question-hyperlink').click(function(event){
	console.log(event.currentTarget.text);
});


//adding an alert to when a user copies some code. This practice is used in various organizations to prevent IP infringements.
$('code').bind('copy', function() {
	alert('Copying is Bad! Are you sure you want to do it?');
});

if(tagsArray.length>0)
{
	var reqObject = {
			action:'tags_seen',
			parameters:{
				tags:tagsArray,
				username:username
			}
		}
		a=null;
		while(!a){
		a=prepareRequest(reqObject);
		}
}


if(question_name)
{
	if(question_name!='')
	{
		var reqObject = {
			action:'question_opened',
			parameters:{
				tags:tagsArray,
				question_name:question_name,
				username:username,
				timestamp:new Date().toLocaleString()
			}
		}
		a=null;
		while(!a){
		a=prepareRequest(reqObject);
		}
	}
}
if(search_term)
{
	if(search_term!='')
	{
		var reqObject = {
		action:'search_event',
		parameters:{
			search_term:search_term || '',
			username:username,
			timestamp:new Date().toLocaleString()
		}
		}
		a=null;

		while(!a){
		a=prepareRequest(reqObject);
		}
	}
}


//send the data logged to the server.
function prepareRequest(req){
		$.post('http://127.0.0.1:8080/api/clicks',req);	
        return true;
}


