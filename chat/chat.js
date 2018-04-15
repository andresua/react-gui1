// Colección de MongoDB
Messages = new Mongo.Collection("messages");

if (Meteor.isClient) {
	Meteor.absoluteUrl.defaultOptions.rootUrl = location.protocol + "//" + location.host;
	setTimeout(()=>{
	  //this.state = new ReactiveDict();
	  var temperatura = Meteor.subscribe('temperatura');
	  var voltaje = Meteor.subscribe('voltaje');
	  var humedad = Meteor.subscribe('humedad');

		try {
		/*
		 * Flot Interactive Chart
		 * -----------------------
		 */
		// We use an inline data source in the example, usually data would
		// be fetched from a server
		interactive_plot = [];
		updateInterval = 500 //Fetch data ever x milliseconds
		dataGeneral = [], totalPoints = 100;
		function update() {
		  interactive_plot.forEach((ip) => {
			  if(ip.realtime === 'on')
				ip.setData([ip.getRandomData()])
			    ip.draw()
		  })
		  // Since the axes don't change, we don't need to call plot.setupGrid()
		  setTimeout(update, updateInterval)
		};
		for (const sensor of [{name:"temperatura",color:"#f39c12"}, {name:"voltaje",color:"#3c8dbc"}, {name:"humedad",color:"#dd4b39"}]) {
			
			dataGeneral.push([]);
			const lastIP = interactive_plot.length;
			  const getRandomData = function() {
				
			  if (data[lastIP].length > 0)
				data[lastIP] = data[lastIP].slice(1)
			  // Do a random walk
			  while (data[lastIP].length < totalPoints) {
				data[lastIP].push(Math.min(100, Math.max(0, (data[lastIP].length > 0 ? data[lastIP][data[lastIP].length - 1] : 50) + Math.random() * 10 - 5)))
			  }
			  // Zip the generated y values with the x values
			  var res = []
			  for (var i = 0; i < data[lastIP].length; ++i) {
				res.push([i, data[lastIP][i]])
			  }
			  return res
			};
			
			
			var sensorName = sensor.name;
			var backColor = sensor.color;
			interactive_plot.push($.plot('#interactive_'+sensorName, [getRandomData()], {
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
			);
			interactive_plot[lastIP].realtime       = 'on' //If == to on then fetch data every x seconds. else stop fetching
			interactive_plot[lastIP].getRandomData       = getRandomData 
			
			//INITIALIZE REALTIME DATA FETCHING
			if (interactive_plot[lastIP].realtime === 'on') {
			  update()
			}
			//REALTIME TOGGLE
			$('#realtime_' + sensorName + ' .btn').click(() => {
			  if ($(this).data('toggle') === 'on') {
				interactive_plot[lastIP].realtime = 'on'
			  }
			  else {
				interactive_plot[lastIP].realtime = 'off'
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
    }, 1000);
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
    return Messages.find();
  });
  Meteor.publish('voltaje', function streamVoltajePublication() {
    return Messages.find();
  });
  Meteor.publish('humedad', function streamHumedadPublication() {
    return Messages.find();
  });
  
  Meteor.startup(function () {
    // Código que se ejecuta al iniciar el servidor
  });
}
