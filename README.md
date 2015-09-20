# json-Inspector
render an inspectable (clickable) json object with javascript, similar to the chrome inspector

Currently a jquery plugin written years ago, but soon to be upgraded to a more modern module.

Use like: 
	$("#json-here").renderJson({
            'name':'hello',
            'data':'world',
            'date':'2012-03-19T23:22:21',
            'children':[
                {'name':'first-child', 'id':'1234'},
                {'name':'second-child', 'id':'5678'}
            ]
        });