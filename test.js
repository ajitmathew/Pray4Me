Messages = new Meteor.Collection("messages");
Rooms = new Meteor.Collection("Rooms");

if (Meteor.isClient) {
  // counter starts at 0
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
    },
	'click .pray4someone': function () {
		Session.set('state','pray4someone');
	  	console.log(Session.get('state'));
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
  sendMessage = function() {
   /* var el = document.getElementById("msg");
    Messages.insert({user: Meteor.user().username, msg: el.value, ts: new Date(), room: Session.get("roomname")});
    el.value = "";
    el.focus();*/
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
