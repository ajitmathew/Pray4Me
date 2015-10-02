Messages = new Meteor.Collection("messages");
Rooms = new Meteor.Collection("Rooms");
var id;
var count=0;
if (Meteor.isClient) {
  // counter starts at 0
  Accounts.ui.config({
	    passwordSignupFields: 'USERNAME_ONLY'
	  });
  Session.setDefault('state', 'welcome');

  Template.hello.helpers({
	  'isPray4me' : function (){
		  if(Session.get('state') == 'pray4me'){
			  return true;
		  }
		  else{
			  return false;
		  }
	  },
	  'isWelcome': function (){
		  if(Session.get('state') == 'welcome'){
			  return true;
		  }
		  else {
			  return false;
		  }
	  },
	  'isPray4someone': function (){
		  if(Session.get('state') == 'pray4someone'){
			  return true;
		  }
		  else{
			  return false;
		  }
	  }
  });

  Template.hello.events({
    'click .pray4me': function () {
      // increment the counter when button is clicked
      Session.set('state', 'pray4me');
	  console.log(Session.get('state'));
	  Session.set("roomname",new Date());
	  Rooms.insert({roomname: Session.get("roomname"), req:1, stat:"Waiting" });


    },
	'click .pray4someone': function () {
		if (Rooms.find({req:1,stat:"Waiting"}).count() == 0)
	  		return;
		Session.set('state','pray4someone');
	  	console.log(Session.get('state'));
		id = Rooms.findOne({req:1,stat:"Waiting"})._id;
		var connectroom = Rooms.findOne({_id:id}).roomname;
		console.log(connectroom);
		Rooms.update(id, {$set:{stat:"Connected"}});
		Session.set("roomname",connectroom);
	}
  });

  Template.input.events({
    'click .sendMsg': function(e) {
       _sendMessage();
    },
    'keyup #msg': function(e) {
      if (e.type == "keyup" && e.which == 13) {
        _sendMessage();
      }
    }
  });
  
  Template.leave.events({
	'click .quit': function() {
    	Messages.insert({user: Meteor.user().username, msg: "User has left chat", ts: new Date(), room: Session.get("roomname")});
		Session.set('state','welcome');
		if(Rooms.findOne({roomname:Session.get("roomname")}).stat == "Connected"){
			Rooms.update(id, {$set:{stat:"Disconnected"}});
		}
		else if(Rooms.findOne({roomname:Session.get("roomname")}).stat == "Disconnected"){
			Rooms.remove(id);
		}

	}
  });

  _sendMessage = function() {
    var el = document.getElementById("msg");
    Messages.insert({user: Meteor.user().username, msg: el.value, ts: new Date(), room: Session.get("roomname")});
    el.value = "";
    el.focus();
  };

  Template.messages.helpers({
    messages: function() {
      return Messages.find({room: Session.get("roomname")}, {sort: {ts: 1}});
    },
	roomname: function() {
      return Rooms.findOne({roomname:Session.get("roomname")}).stat;
    }
  });
  
  
};
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
