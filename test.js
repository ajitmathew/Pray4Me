Messages = new Meteor.Collection("messages");
Rooms = new Meteor.Collection("Rooms");
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
	  Rooms.insert({roomname: Meteor.user().username, req:1, resp:0 });
	  Session.set("roomname",Meteor.user().username);

    },
	'click .pray4someone': function () {
		Session.set('state','pray4someone');
	  	console.log(Session.get('state'));
		var id = Rooms.findOne({req:1,resp:0})._id;
		var connectroom = Rooms.findOne({_id:id}).roomname;
		console.log(connectroom);
		Rooms.update(id, {$set:{resp:1}});
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
      return Session.get("roomname");
    }
  });
  
  
};
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
