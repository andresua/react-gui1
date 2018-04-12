// Colección de MongoDB
Messages = new Mongo.Collection("messages");

if (Meteor.isClient) {

    // Lista de mensajes que está vigilando
    Template.body.helpers({
    messages: function () {
      return Messages.find({});
    }
    });

    // Al capturar un evento de submit de .message-form
    Template.body.events({
    'submit .message-form': function () {

        // Previene el comportamiento normal
        event.preventDefault();

        // Obtiene el texto del campo de texto
        var text = event.target.message.value;

         // Agrega un mensaje
         Messages.insert({
           text: text,
           createdAt: new Date()
         });

         event.target.message.value = "";
    }
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // Código que se ejecuta al iniciar el servidor
  });
}
