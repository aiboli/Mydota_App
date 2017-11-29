
var Dota2Api = require('../lib/dota2api.js');
var dota     = new Dota2Api('<key>');

dota.GetLeagues( function ( err , data ) 
{
	if( !err)
	{
		for( var index in data.leagues )
		{
			console.log( data.leagues[ index].leagueid  + "->" + data.leagues[ index].name );
		}
	}
	
});