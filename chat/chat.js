// Colección de MongoDB
Messages = new Mongo.Collection("messages");

if (Meteor.isClient) {
	Meteor.absoluteUrl.defaultOptions.rootUrl = location.protocol + "//" + location.host;
	setTimeout(()=>{
	  //this.state = new ReactiveDict();
	  Meteor.subscribe('temperatura');
	  Meteor.subscribe('voltaje');
	  Meteor.subscribe('humedad');

		try {
		/*
		 * Flot Interactive Chart
		 * -----------------------
		 */
		// We use an inline data source in the example, usually data would
		// be fetched from a server
		function getRandomData() {
			
		  var data = [], totalPoints = 100
		  if (data.length > 0)
			data = data.slice(1)
		  // Do a random walk
		  while (data.length < totalPoints) {
			var prev = data.length > 0 ? data[data.length - 1] : 50,
				y    = prev + Math.random() * 10 - 5
			if (y < 0) {
			  y = 0
			} else if (y > 100) {
			  y = 100
			}
			data.push(y)
		  }
		  // Zip the generated y values with the x values
		  var res = []
		  for (var i = 0; i < data.length; ++i) {
			res.push([i, data[i]])
		  }
		  return res
		}
		
		for (const sensor of [{name:"temperatura",color:"#f39c12"}, {name:"voltaje",color:"#3c8dbc"}, {name:"humedad",color:"#dd4b39"}]) {
			var sensorName = sensor.name;
			var backColor = sensor.color;
			var interactive_plot = $.plot('#interactive_'+sensorName, [getRandomData()], {
			  grid  : {
				borderColor: '#f3f3f3',
				borderWidth: 1,
				tickColor  : '#f3f3f3'
			  },
			  series: {
				shadowSize: 0, // Drawing is faster without shadows
				color     : backColor
			  },
			  lines : {
				fill : true, //Converts the line chart to area chart
				color: backColor
			  },
			  yaxis : {
				min : 0,
				max : 100,
				show: true
			  },
			  xaxis : {
				show: true
			  }
			})
			var updateInterval = 500 //Fetch data ever x milliseconds
			var realtime       = 'on' //If == to on then fetch data every x seconds. else stop fetching
			var update = function() {
			  interactive_plot.setData([getRandomData()])
			  // Since the axes don't change, we don't need to call plot.setupGrid()
			  interactive_plot.draw()
			  if (realtime === 'on')
				setTimeout(update, updateInterval)
			}
			//INITIALIZE REALTIME DATA FETCHING
			if (realtime === 'on') {
			  update()
			}
			//REALTIME TOGGLE
			$('#realtime .btn').click(() => {
			  if ($(this).data('toggle') === 'on') {
				realtime = 'on'
			  }
			  else {
				realtime = 'off'
			  }
			  update()
			})
		}
		/*
		 * END INTERACTIVE CHART
		 */
		 
		 
		   // Make the dashboard widgets sortable Using jquery UI
		  $('.connectedSortable').sortable({
			placeholder         : 'sort-highlight',
			connectWith         : '.connectedSortable',
			handle              : '.box-header, .nav-tabs',
			forcePlaceholderSize: true,
			zIndex              : 999999
		  });
		  $('.connectedSortable .box-header, .connectedSortable .nav-tabs-custom').css('cursor', 'move');
		} catch(e) {
			console.log(e);
		}
    }, 10000);
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
  Meteor.publish('temperatura', function streamTemperaturaPublication() {
    return {};
  });
  Meteor.publish('voltaje', function streamVoltajePublication() {
    return {};
  });
  Meteor.publish('humedad', function streamHumedadPublication() {
    return {};
  });
  
  Meteor.startup(function () {
    // Código que se ejecuta al iniciar el servidor
  });
}
