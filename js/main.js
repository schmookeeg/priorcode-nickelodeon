var addToHomeConfig = {
	animationIn: 'bubble',
	autostart: false,
	animationOut: 'drop',
	touchIcon: true,
	message: 'Add this Web App to your <strong>%device</strong> Home Screen.<br />Click %icon below.'
};

twttr.events.bind('tweet', function(event) {
	if(_gaq){ _gaq.push(['_trackEvent', 'Page View', 'Tweet']); }
   window.location = "http://m.turtlesvsfoot.com"

});


/*
***  Initialize The Facebook App  ***
*/

fb = null;
var scope = "";
(function(d) {
	 var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	 if (d.getElementById(id)) {return;}
	 js = d.createElement('script'); js.id = id; js.async = true;
	 js.src = "//connect.facebook.net/en_US/all.js";
	 ref.parentNode.insertBefore(js, ref);
}(document));



 window.fbAsyncInit = function() 
 {
 	fb = new FacebookInterface("108880405921698" , "");	
 	fb.loginCallback = handleFbLogin;
 };

 /*
***  End Initialize The Facebook App  ***
*/
//This method will be called automaitcally when share is activated
function facebookLogin()
{
	fb.login(scope, handleFbLogin);	
};


//Assigned callback to facebook class
function handleFbLogin(response)
{
	
	if(response.authResponse)
		console.log("User Accepted App" , "[User ID] : ", response.authResponse.userID);	
	else
		console.log("User Declined App")
};


/* BACKBONE MODELS */
Mission = Backbone.Model.extend({
	defaults: {
		"status"      : "incomplete",
		"team"        : "turtles",
		"turtleStats" : "75%",
		"footStats"   : "25%"
	}
});

/* BACKBONE COLLECTION */
Missions = Backbone.Collection.extend({
	url   : "js/missions.js",
	model : Mission,
	
	localStorage: new Store("tmnt-misssions"),
	
	getJSObj :  (function (data) {
		var self = this;
		$.getJSON(this.url, function (data){
			//self.localStorage.create(data);
		});
	}),
	
	
	initialize : function () {
		this.getJSObj();
		// this.fetch({add:true, async:false});		
	}	
});

/* BACKBONE VIEWS */
window.HomeView = Backbone.View.extend({
	
	initialize : function() {
		this.template = _.template($('#home').html());
	},
	events : {
		'click .home' : function() { app.choose(); }
	},
	render: function() {	
		var repaint = $('<h1 class="black">TMNT</h1>');
		$(this.el).html(this.template());
		$(this.el).append(repaint);
		this.analytics();
		return this;
	},
   	analytics: function() { // analytics
		if(_gaq){
            console.log("GOOGLE ANALYTIC: " + 'Join Battle');
            _gaq.push(['_trackPageview', this.analyticsVars]);
        }
    }
});

window.TurtleHomeView = Backbone.View.extend({
	initialize : function() {
		this.template = _.template($('#home-turtle').html());
	},
	render : function() {

		$(this.el).html(this.template());
		if(_gaq){ _gaq.push(['_trackEvent', 'Page View', 'Turtle Home View']); }
		return this;
	}
});

window.FootHomeView = Backbone.View.extend({
	initialize : function() {
		this.template = _.template($('#home-foot').html());
	},
	render : function() {
		$(this.el).html(this.template());
		if(_gaq){ _gaq.push(['_trackEvent', 'Page View', 'Foot Home View']); }
		return this;
	}
});

window.ChooseView = Backbone.View.extend({
	initialize: function() {
		this.analyticsVars = 'Choose';
		this.tweet = TMNT.tweet;
		this.template=_.template($('#choose').html());
	},

	events: {
		'click .badge'            : 'chooseTeam',
		'click .turtle .facebook' : 'facebookTurtle',
		'click .foot .facebook'   : 'facebookFoot'
	},
	render: function() {
		var init_over = $('<div id="overlay"/>'),
      		init_mod = $('<div id="modal"/>'),
      		repaint = $('<h1 class="black">tmnt</h1>');
		$(this.el).html(this.template());
		
        $(this.el).append(init_over, init_mod);
        $(this.el).append(repaint);
        this.analytics()
		return this;
	},
	twitter : function(evt) {
		console.log(evt)
	},
	facebookTurtle: function(evt) {
		var cb = function cb(){
			window.location = "http://m.turtlesvsfoot.com"
		};
		//postFB: function(link, desc, pic, name, cb)
		TMNT.postFB('http://at.nick.com/tvfoot','Mission Accomplished! I’ve joined TMNT at Comic-Con. The Foot Clan stinks!', 'http://m.turtlesvsfoot.com/images/facebookshare/turtleMission1.jpg', 'I’ve joined the Ninja Turtles in the battle for Comic-Con', cb);
	},
	facebookFoot: function(evt) {
		evt.preventDefault();
		var cb = function cb(){
			window.location = "http://m.turtlesvsfoot.com"
		};
		//postFB: function(link, desc, pic, name, cb)
		TMNT.postFB('http://at.nick.com/tvfoot3','Hail Shredder! I’m on the path to power for I have joined the Foot Clan against the TMNT at Comic-Con. ', 'http://m.turtlesvsfoot.com/images/facebookshare/footMission1.jpg', 'I’ve joined the Foot Clan in the battle for Comic-Con', cb);
	},
	chooseTeam: function(evt) {
	evt.preventDefault();
		var data = {},
			info = {},
			h = evt.currentTarget.hash,
			num = h.indexOf('/') + 1,
			teamName = h.slice(num);
			info.team = { name : teamName };
			console.log(info)



        TMNT.missionJSON(teamName, this.collection); // hand off to helper to get feed        
        $.ajax({
		    url: "service.php",
		    cache: false,
		    type: "POST",
		    data: info,
		    statusCode:
                    {
                        201: function (data)
                        {
                            console.log("201", $.parseJSON(data));
                        },
                        304: function (data)
                        {
                            console.log("304", data)
                        },
                        404: function (data)
                        {
                            console.log("404", data)
                        },
                        500: function (data)
                        {
                            console.log("500", data)
                        }
                    }

		});
		this.analyticsVars = ['Choose', teamName];
		this.analytics();
		TMNT.modal(teamName);
		
        
   	},
   	analytics: function() { // analytics
		if(_gaq){
            console.log("GOOGLE ANALYTIC: " + this.analyticsVars);
            _gaq.push(['_trackPageview', this.analyticsVars]);
        }
    }
});

window.MissionView = Backbone.View.extend({

initialize: function() {
		this.analyticsVars = [this.collection.first().get('team'), 'Mission List'];
		this.template = _.template($('#mission').html());
		this.collection.models[0].save("status", "complete");
		this.collection.bind('change', this.render, this);
		if(window.location.hash === '') {
			window.location.hash = '#mission'
		}
		addToHome.show();
		TMNT.stats(this.collection);
	},

	render: function(eventName) {	
		var variables = { 
			missionList: this.collection, 
			team: this.collection.first().get("team") ,
			tStat: this.collection.first().get("turtleStats"),
			fStat: this.collection.first().get("footStats"),
		};
		$(this.el).html(this.template(variables));
		if(_gaq){ _gaq.push(['_trackEvent', 'Page View', 'Mission View' + window.location.hash]); }
		this.analytics();
		return this;
	},
	analytics: function() { // analytics
		if(_gaq){
            console.log("GOOGLE ANALYTIC: " + this.analyticsVars);
            _gaq.push(['_trackPageview', this.analyticsVars]);
        }
     }	
});
/*
	Add MissionDetailView to handle RESTful Routes
*/
window.MissionDetailView = Backbone.View.extend({
	
	initialize : function() {
		this.collection = this.options.collection;
		this.d_id = this.options.d_id-1;
		this.analyticsVars = [this.collection.models[this.d_id].get('team'), this.collection.models[this.d_id].get('title'), this.collection.models[this.d_id].get('status')];
		this.analytics();
		this.collection.bind('change', this.render, this );
	},
	events : {
		'click .submit' : function(event){ this.completeMission(event, this.options.d_id, this.collection) },
		'click .mission6 .facebook' : 'facebook6' ,
		'click .complete-badge' : 'missionList',
		'click .mission1 .content' : 'missionList',
		'change select' : 'datepicker'
	},
	render : function(d_id) {
		var models = this.collection.models,
		//d_id is passes as positive interger.
			d_id = this.d_id,
			details = models[d_id],
			video = '';
			
			this.detailsData = { detailsData : {
				id			: details.get('ID'),
				title 		: details.get('title'),
				reward 		: details.get('reward'),
				description : details.get('description'),
				share 		: details.get('share'),
				input 		: details.get('input'),
				cta 		: details.get('cta'),
				team		: details.get('team'),
				status		: details.get('status'),
				tStat		: details.get('turtleStats'),
				fStat		: details.get('footStats')
				}
			};
			
			//console.log("dataSet",this.detailsData, "element: ",$(this.el));
			
			template = _.template($('#detail').html());
			$(this.el).html(template(this.detailsData));
			return this;
	},
	analytics: function(args) { // analytics
		if (args) {
			this.analyticsVars.push(args)
		}
		if(_gaq){
            console.log("GOOGLE ANALYTIC: " + this.analyticsVars);
            _gaq.push(['_trackPageview', this.analyticsVars]);
        }
    },
	datepicker : function(evt) {
		var spanID = evt.target.id.replace('-choice-', '-');
		$('#'+spanID).html(evt.target.value)
	},
	missionList : function() {
		window.location = '#mission';
	},
	facebook6 : function() {
		var model = this.collection.models[5],
			cb6 = function() { window.location = "http://m.turtlesvsfoot.com/#mission" };
		TMNT.postFB(model.get('link'), model.get('desc'), 'http://m.turtlesvsfoot.com/images/facebookshare/'+model.get('pic'), model.get('name'), cb6)
	},
	completeMission : function(evt, d_id, collection) {
		evt.preventDefault();
		this.analytics('CTA click');
		var cb;
		// d_id corresponds to the mission
		switch(d_id) {
			case '2':
				this.collection.models[this.options.d_id-1].save('status', 'complete');
				$('.content', this.el).addClass('complete-badge');
			break;
			case '3':
				this.collection.models[this.options.d_id-1].save('status', 'complete');
				$('.content', this.el).addClass('complete-badge');
			break;
			case '4':
				var phoneVal = $('input[name="phone"]').val().replace(/\D/g, ''),
					reg = /\d{10}/,
					info = {},
					team = this.collection.models[d_id-1].get('team'),
					name = collection.models[d_id-1].get('id');
				if(phoneVal !== "5555555555" && reg.test(phoneVal) === true) {
					// post phoneVal to API here
					info = {user: {name: name ,  email : "", phone : phoneVal, team : team }};
					$.ajax({
					    url: "service.php",
					    cache: false,
					    type: "POST",
					    data: info,
					    success: function(data) {
					    	console.log('post to api: ', info);
					    }
					});
					
					this.collection.models[d_id-1].save('status', 'complete');
					$('.content', this.el).addClass('complete-badge');
				}
					
			break;
			case '5':
				var month = parseInt(document.getElementById('select-choice-month').value) -1,
					day = parseInt(document.getElementById('select-choice-day').value),
					year = parseInt(document.getElementById('select-choice-year').value),
					bday = new Date(year, month, day),
					today = new Date(),
					oldEnough = false,
					info = {},
					mod = collection.models[d_id-1],
					team = mod.get('team'),
					name = mod.get('id'),
					postEmail = function() {
						var div = document.getElementById('enteremail'),
							email = $('input[name="email"]', div).val(),
							box = $('input[name="related"]', div).is(':checked'),
							emailregex = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
							
						if (box === true) {
							// you checked the box
							if (emailregex.test(email) === true) {
								// your email is valid
								
								info = {user: {name: name ,  email : email, phone : "", team : team }};
								console.log('post email to API', info);
								$.ajax({
								    url: "service.php",
								    cache: false,
								    type: "POST",
								    data: info,
								    success: function(data) {
								    	console.log('post to api: ', info);
								    }
								});
								// save status
								mod.save('status', 'complete');
								// render complete badge
								$('.content', this.el).addClass('complete-badge');
							} else if (email.regex.test(email) === false) {
								alert('Oops, Your Email Address Is Not Valid');
							}
						} else if (box === false) {
							// you didn't check the box
							alert('Oops! To Send You The Video, You Need To Check The Box.');
						}
					};
					
				if(bday < today.setFullYear(1999)) { 
					// you are of age
					TMNT.oldEnough = true;
					$('.birthday').hide();
					$('#tmntdatepicker').hide();
					$('#enteremail').show();
					$('.submit').on('click', postEmail);
				} else if(TMNT.oldEnough = false) {
					// you are not of age
					alert('Age Notification. You Need To Be 13 Or Over To Participate In This Promotion.')
				}
			break;
			case '6':
				var model = collection.models[d_id-1],
					tweetText = model.get('tweet');
				model.save('status', 'complete');
				if (window.navigator.userAgent.indexOf('iPhone') > -1) {
					// iOS
					$.ajax({
					    url: "get_uplynk_video.php?id=f62dd7433a6e4fc6a76b8e1b247ee937&type=a&t="+Math.random(),
					    cache: false,
					    type: "GET",
					    contentType: "application/json; charset=utf-8",
					    dataType:"text",
					    success: function(data){
				            $('.content').html('<video controls poster="images/tmnt-trailer-play.jpg"><source id="ios" src="'+data+'">Your browser does not play videos</video><p class="left twitter"><a href="//twitter.com/intent/tweet?text='+tweetText+'&url=http%3A%2F%2Fat.nick.com/MaPNcE&hashtags=TVF"></a></p><p class="right facebook"></p>');
				            }
					        
					});
				} else {
					$('.content').html('<video controls poster="images/tmnt-trailer-no-play.jpg"><source src="video/tmnt_trailer.m4v">Your browser does not play videos</video><p class="left twitter"><a href="//twitter.com/intent/tweet?text='+tweetText+'&url=http%3A%2F%2Fat.nick.com/MaPNcE&hashtags=TVF"></a></p><p class="right facebook"></p>');
				}
			    
				
			break;
		}
		
		/*
		this.collection.models[this.options.d_id-1].save('status', 'complete');
		app.mission();	
		*/
	},
	birthday : function(evt) {
		evt.preventDefault();
		var elems = document.getElementById('tmntdatepicker').getElementsByTagName('select'),
			month = parseInt(document.getElementById('select-choice-month').value),
			day = parseInt(document.getElementById('select-choice-day').value),
			year = parseInt(document.getElementById('select-choice-year').value),
			bday = month+day+year;
			
			// add conditional checked
		$('.birthday').hide();
		$('#tmntdatepicker').hide();
		$('#enteremail').show();
				
	}
});


window.LegalView = Backbone.View.extend({
	initialize: function() {
		this.analyticsVars = [this.collection.first().get('team'), 'Legal'];
	},
	template:_.template($('#legal').html()),
	render: function() {
	var variables = { 
			team: (this.collection.length > 0) ? chosenTeam = this.collection.first().get("team") : 'turtles',
			tStat: (this.collection.length > 0) ? chosenTeam = this.collection.first().get("turtleStats") : '75%',
			fStat: (this.collection.length > 0) ? chosenTeam = this.collection.first().get("footStats") : '25%',
		};
		$(this.el).html(this.template(variables));
		this.analytics();
		return this;
	},
	analytics: function() { // analytics
		if(_gaq){
            console.log("GOOGLE ANALYTIC: " + this.analyticsVars);
            _gaq.push(['_trackPageview', this.analyticsVars]);
        }
    }
});

window.RulesView = Backbone.View.extend({
	initialize: function() {
		this.analyticsVars = [this.collection.first().get('team'), 'Official Rules'];
	},
	template:_.template($('#rules').html()),
	render: function() {
		var variables = { 
			team: (this.collection.length > 0) ? chosenTeam = this.collection.first().get("team") : 'turtles',
			tStat: (this.collection.length > 0) ? chosenTeam = this.collection.first().get("turtleStats") : '75%',
			fStat: (this.collection.length > 0) ? chosenTeam = this.collection.first().get("footStats") : '25%',
		};
		$(this.el).html(this.template(variables));
		this.analytics();
		return this;
	},
	analytics: function() { // analytics
		if(_gaq){
            console.log("GOOGLE ANALYTIC: " + this.analyticsVars);
            _gaq.push(['_trackPageview', this.analyticsVars]);
        }
    }
});

/* BACKBONE ROUTER */
var AppRouter = Backbone.Router.extend({	
	routes: {
		'' 				: 'choose',
		'home/turtle'	: 'homeTurtle',
		'home/foot'		: 'homeFoot',
		'choose' 		: 'choose',
		'choose/:team'	: 'choose',
		'mission'	 	: 'mission',
		'legal'			: 'legal',
		'rules'			: 'rules',
		'details'		: 'details',
		'detail/:id'	: 'detail' // i.e http://tnmt.com/#detail/1
	},
	
	initialize: function() {
		$('.back').live('click', function(event) {
			window.history.back();
			return false;
		});
		this.firstPage = true;
	},
	
	home: function() {
		if (window.localStorage.getItem('tmnt-misssions') !== null) {
			TMNT.localToCollection();
		} else {
			this.changePage(new HomeView({collection: teamMissions}));
		}		
	},
	
	homeTurtle: function() {
		if (window.localStorage.getItem('tmnt-misssions') !== null) {
			TMNT.localToCollection();
		} else {
			this.changePage(new TurtleHomeView({collection: teamMissions}));
		}		
	},
	
	homeFoot: function() {
		if (window.localStorage.getItem('tmnt-misssions') !== null) {
			TMNT.localToCollection();
		} else {
			this.changePage(new FootHomeView({collection: teamMissions}));
		}		
	},
	
	choose: function(team) {
		if (window.localStorage.getItem('tmnt-misssions') !== null) {
				TMNT.localToCollection();
			} else {
			this.changePage(new ChooseView({collection: teamMissions}));
		}
	},
	
	mission: function() {
		this.changePage(new MissionView({collection: teamMissions}));
	},
	
	legal: function() {
		this.changePage(new LegalView({collection: teamMissions}));
	},
	
	rules: function() {
		this.changePage(new RulesView({collection: teamMissions}));
	},
	
	detail : function (id) {
		this.changePage(new MissionDetailView({collection: teamMissions, d_id: id}));
	},
	
	changePage: function(page) {
		$('body div[data-role="page"]').fadeOut( function() { $(this).remove() } );
		$(page.el).attr('data-role', 'page');
		page.render();
		$('body').append($(page.el));		

		TMNT.setHeight();
		setTimeout( function() { window.scrollTo( 0, 1 )}, 100);
	}
	
});


/* HELPERS */
var TMNT = {
	setHeight: function() {
		var wHeight = $(window).height(),
			hHeight = $('[data-role="header"]').height(),
			iHeight = wHeight - hHeight;
		$('[data-role="content"]').css('min-height', wHeight-30);
		$('.inner').not('.home .inner').css('min-height', iHeight + 40);
	},
	
	postFB: function(link, desc, pic, name, cb) {
		
		var obj = {
    		display     : 'touch',
			method      : 'feed',
			link        : link ||'http://m.turtlesvsfoot.com',
			picture     : pic,
			name        : name || 'Turtles vs Foot Clan',
			description : desc || 'Teenage Mutant Ninja Turtles'
        };

		FB.ui(obj, function (response) {
				//console.log("Post Response" , arguments);
			if(response !== undefined && response !== null) {
				console.log("Post Success" , "[Response] :", response);
				cb();
			}else {
				console.log("Post Cancelled");
				cb();
			}		
		});	
	},
	
	tweet: function() {
		window.location.hash = '#mission';
		window.open('//www.twitter.com');
	},
	
	modal: function(team) {
		var ßmsg;
					
		switch(team) {
	    	 case 'turtles':
	    	 ßmsg = "<div class='share turtle'><h1 class='green'>Message From<br />Master Splinter: <span>Honorable Decision,<br />Young Ninja</span></h1><p>For your first mission, log in below and declare your allegiance to the turtles.</p><div class='social-links green'><span class='facebook'>facebook</span> or <a class='twitter' href='https://twitter.com/intent/tweet?text=Mission%20Accomplished!%20I%E2%80%99ve%20joined%20%23TMNT%20at%20%23ComicCon.%20The%20%23FootClan%20stinks!%20%23TVF&url=http%3A%2F%2Fat.nick.com/tvfoot'>Twitter</a></div></div>";
			break;
			case 'foot' :
			ßmsg = "<div class='share foot'><h1 class='red'>Message From<br />Master Shredder: <span>You have chosen well, my minion.</span></h1><p>To prove your loyalty, log in below and declare your obedience to the foot.</p><div class='social-links red'><span class='facebook'>facebook</span> or  <a class='twitter' href='https://twitter.com/intent/tweet?text=Hail%20Shredder!%20I%E2%80%99m%20on%20the%20path%20to%20power%20for%20I%20have%20joined%20the%20%23FootClan%20against%20the%20%23TMNT%20at%20%23ComicCon.%20%23TVF&url=http%3A%2F%2Fat.nick.com/tvfoot3'>Twitter</a></div></div>";
			break;
			}
		
	      var $ol = $('div#overlay'),
	          $mdl = $('div#modal'),
	          $w = document.width,
	          $h = document.height;
	       
	
	      function startModal () {
	         $mdl.html(ßmsg);
	
	         var $mdlW = $mdl.width(),
	           $mdlH = $mdl.height(),
	           top = (($h/2)-($mdlH/2)),
	           left = (($w/2)-(($w*.9)/2));
	
	
	          $mdl.css({
	             'position' : 'absolute',
	             'width'    : "90%",
	             'top'      : top+"px",
	             'left'     : left+"px",
	             'z-index'  : 1000
	          })
	      }
	
	      $.map( [$ol, $mdl], function(val,idx) {
	       var _id = val.attr('id'),
	            modalStarted = false;
	        if (_id == 'overlay') {
	          val.css({
	             "width"            : $w+"px",
	             "height"           : $h+"px",
	             "background-color" : "#000",
	             "z-index"          : 999,
	             'position'         : 'absolute',
	             'top'              : 0,
	             'right'            : 0,
	             'opacity'          : 0
	          }).animate({opacity: .9}, { step : function (now, fx){
	               var data = fx.elem.id + ' ' + fx.prop + ': ' + now;
	
	               if (now > 0.5) {
	                  if(!modalStarted) {
	                     startModal();
	                     modalStarted = true
	                  }
	               }
	            }
	          });//end animate
	        }//end if
		})//end map

	},
	
	missionJSON : function (team, collection) {
		
	
		var makeModels = function(data) {
				
			var d = JSON.parse(data);
			$.each(d, function(mod) {
				collection.create(d[mod]) //adding each model to localStorage
			} );
		
		
		};
	
		$.ajax({
		url: "js/missions-"+team+".js", 
		asynch: false,
		datatype: 'json',
		success: makeModels
		});
		
	},
	
	localToCollection : function() {
		var localstore = JSON.parse(localStorage.getItem('tmnt-misssions'));
		
		$.each(localstore, function(mod) {
				teamMissions.add(localstore[mod]);
		});
		
		app.mission({collection: teamMissions});
	},
	
	stats : function(collection) {
		$.ajax({
		    url: "service.php?team",
		    cache: false,
		    type: "GET",
		    contentType: "application/json; charset=utf-8",
		    dataType:"json",
		    success: function(data){
		            data = $.parseJSON(data);
		                var footPer = Math.round((data.foot / data.total) * 100) + "%",
		               		turtlesPer = Math.round((data.turtles / data.total) * 100) + "%";
		                
		            $.each(collection.models, function(idx, model) {
		    			model.save('turtleStats', turtlesPer);
		    			model.save('footStats', footPer);
		    		});
		    }
		})
	}

}

TMNT.oldEnough = false;


$(document).ready(function(){
app = new AppRouter();

if (window.localStorage.getItem('tmnt-misssions') !== null) {
	teamMissions = new Missions();
	TMNT.localToCollection();
} else {
	teamMissions = new Missions();
}
	Backbone.history.start({pushState:false});
	TMNT.setHeight();
	
	
setTimeout( function() { window.scrollTo( 0, 1 )}, 100);
});NT.setHeight();
	
	
setTimeout( function() { window.scrollTo( 0, 1 )}, 100);
});