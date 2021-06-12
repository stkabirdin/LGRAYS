var xlsx = require('xlsx');
var fs = require('fs');
var express = require('express');
var appServer = express();
var server = appServer.listen(3000, function () {
    console.log("Listening on port %s...", server.address().port);
});
var js = [];
var data  = xlsx.readFile('NationalRetail.xls');
var j=0;
var i=0;
var states = [];
var crops = [];

while(i < data.SheetNames.length-1){
js[j]= xlsx.utils.sheet_to_json(data.Sheets[data.SheetNames[i]]);
j++;
i+=2;
}
 
function get_header_row(sheet) {
    var headers = [];
    var range = xlsx.utils.decode_range(sheet['!ref']);
    var C, R = range.s.r; 
    for(C = range.s.c+2; C <range.e.c; ++C) {
        var cell = sheet[xlsx.utils.encode_cell({c:C, r:R})] /* find the cell in the first row */

        var hdr = "UNKNOWN " + C; 
        if(cell && cell.t) hdr = xlsx.utils.format_cell(cell);

        headers.push(hdr);
    }
    return headers;
}


function get_header_column(data) {
    var headers = [];
    for(var i=0; i<data.length ; i++) {

        headers.push(data[i]['URBAN RETAIL PRICE OF SELECTED ITEMS ']);
    }
    
    return headers;
}

function getPrice(crop, state)

{
    var priceMap = {};
    var year = 2016;
    for (var i=0; i<js.length; i++){
        sheet = js[i];
        for (var j=0;j<sheet.length; j++){
            if (sheet[j]['URBAN RETAIL PRICE OF SELECTED ITEMS '] = crop){
                element = sheet[j];
                    for (var Key in element) {
                        if (element.hasOwnProperty(Key) && Key == state) {
                            priceMap[year] = element[Key];
                        }
                    }   
                break;
            }
        }
        year = year+1;
    }
    return priceMap;

}

function hash_to_json(hashMap)

{
    var data = [];
      Object.keys(hashMap).map(function(key, index) {
      const obj = new Object();
      obj.x = key;
      obj.y = hashMap[key];
      data.push(obj);
    });
    return data;
}

states = get_header_row(data.Sheets[data.SheetNames[0]]);
crops = get_header_column(js[0]);

appServer.get('/',function(req,res){
    res.sendFile('/Users/harish/desktop/JavaScript/ReleafDashboard/index.html');

});

appServer.get('/getStates',function(req, res){
	console.log("States rendered");
	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.send(JSON.stringify(states));
});

appServer.get('/getCrops',function(req, res){
    console.log("Crops rendered");
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.send(JSON.stringify(crops));
});

appServer.get('/processData',function(req, res){
    console.log("Process rendered");
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
	var state=req.query.state;
	var crop=req.query.crop;
	var priceMap = getPrice(crop, state);
    var pricejson = hash_to_json(priceMap);
    console.log(pricejson);
    res.send(JSON.stringify(pricejson));
});




	


