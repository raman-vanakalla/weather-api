const express=require('express');
const axios=require('axios');
const app=express();
var bodyParser=require('body-parser');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


const API_KEY='AIzaSyD9PtG9JAwPcwLROAiJ1VhGwNTA-5hTBQo';
const FORECAST_API_KEY='458fa05e720d86b76f5c4d82bb2ada61';

app.get('/:place',(req,res)=>
	{
		var dataToBeSent={};
		const encodedLocation=encodeURIComponent(req.params.place);
        const geoAddress=`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedLocation}&key=${API_KEY}`;
		const locationPromise=axios.get(geoAddress)
		locationPromise.then((response)=>
		{
			if(response.data.status==='OK')
	    	{
               dataToBeSent.location=response.data.results[0];
               const lat=response.data.results[0].geometry.location.lat;
               const lng=response.data.results[0].geometry.location.lng;
               const forecastAddress=`https://api.darksky.net/forecast/${FORECAST_API_KEY}/${lat},${lng}`;
               return axios.get(forecastAddress);
    	    }
        	else if(response.data.status==='ZERO_RESULTS')
        	{
                var e=new Error();
                e.code='NO_LOCATIONS';
                e.message='no locations matched';
                throw e;
        	}

		}).then((response)=>
		{
			console.log("ippud chudu");
			dataToBeSent.weather=response.data;
			res.send(dataToBeSent);
		}).catch((e)=>
		{
			var toSendError=new Error();
			if(e.code=='ENOTFOUND')
			{
				var e =new Error();
				e.code='NETWORK_ERROR';
				e.message='some problem with geoserver';
				toSendError=e;
			}
			else if(e.code=='NO_LOCATIONS')
            {
            	toSendError=e;
            }
            res.send(JSON.stringify(e));
		});
	});

app.listen('8080');