var express = require('express'), // "^4.13.4"
    aws = require('aws-sdk'), // ^2.2.41
    bodyParser = require('body-parser'),
    multer = require('multer'), // "multer": "^1.1.0"
    multerS3 = require('multer-s3'); //"^1.4.1"
const config = require('./config.json');
var alert = require('alert-node');


var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
var docClient = new AWS.DynamoDB.DocumentClient();

aws.config.update({
    secretAccessKey: 'Ned4OKfoO16NOp9dcT57VAU/opWpo6MLbCtDo22P',
    accessKeyId: 'ASIAVMZ4SXBILNVWKHQX',
    sessionToken: 'FwoGZXIvYXdzELH//////////wEaDOrPrhwK4bn3K7ie9CLBAQ+JsEgLYayVxxnHSvn3ikZAUJTnJJuPceCFso7M9x/6y/K5vCkNxcu7o/Coz3JP3KbVMQDfLwSFLFsCrf0Bs9cHtO1m7H8CJcYj2BupV5GqfrUK5GsD1krKqK/20KJhNE9stLYr/Ap0nhDfg9SD/LMbIMvdDCOiFi9uTLGpDLheHBls59ZopKrhdNtLRPRxHI9ofWCVgnW43KVfpnMWuOpmiSveFe6VcXFvqibCBh6svd4QjtYitkJNilc6cCdQ+1go/Ou6/gUyLV11YzSTe54AFdl97CLxDIWgJFoi+8bdmTWbFPnyQyHSvI0aJoJ0ABokxaxEZw==',
    region: 'us-east-1'
});

var app = express(),
    s3 = new aws.S3();
app.use(express.static(__dirname + '/'));

app.use(bodyParser.json());

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'mycloudprojectbucket',
        key: function(req, file, cb) {
            console.log(file);
            cb(null, file.originalname); //use Date.now() for unique file keys
        }
    })
});

//open in browser to see upload form
app.get('/', function(req, res) {
    //res.render('index.ejs');
    res.sendFile(__dirname + '/index.html');
});

//used by upload form
app.post('/upload', upload.array('upl', 1), function(req, res, next) {
    //res.send("Uploaded!");
    //window.alert("File uploaded to S3");
    alert('Processing the recording. It may take upto 5 minutes to show the results');
    res.sendFile(__dirname + '/index.html');
    //res.render('index');
});

app.get('/results', function(req, res) {
    var param = {
        TableName: 'cloudprojectchinmay-ResultsDDBtable-BYPJCV23SLL5',
        KeyConditionExpression: null,
        //,Key: {
        //    Key: { 'KEY_NAME': partitionKey }
        //},
        //ProjectionExpression: 'ATTRIBUTE_NAME'
    };

    docClient.scan(param, onScan);

    function onScan(err, data) {
        if (err) {
            //document.getElementById('textarea').innerHTML += "Unable to scan the table: " + "\n" + JSON.stringify(err, undefined, 2);
            console.log(err)
            res.set("content-type", "text/html");

            res.send(
                "123"
            )
            res.end()


        } else {
            // Print all the movies
            // // document.getElementById('textarea').innerHTML += "Scan succeeded. " + "\n";
            // // data.Items.forEach(function(movie) {
            // //     document.getElementById('textarea').innerHTML += movie.year + ": " + movie.title + " - rating: " + movie.info.rating + "\n";
            // });

            // Continue scanning if we have more movies (per scan 1MB limitation)
            // document.getElementById('textarea').innerHTML += "Scanning for more..." + "\n";
            // params.ExclusiveStartKey = data.LastEvaluatedKey;
            // docClient.scan(params, onScan);

            console.log(data);
            //res.render('index', data);

            res.set('content-type', "text/html");
            let datahtml = `<html><head><style>
            table {
              font-family: arial, sans-serif;
              border-collapse: collapse;
              width: 100%;
            }
            
            td, th {
              border: 1px solid #dddddd;
              text-align: left;
              padding: 8px;
            }
            
            tr:nth-child(even) {
              background-color: #dddddd;
            }
            </style></head><table><thead><tr><th> S.No</th><th> Feedback</th><th> Transcript</th></tr></thead><tbody>`
            for (let i = 0; i < data.Items.length; i++) {
                const item = data.Items[i];
                datahtml += '<tr><td> ' + i + '</td><td> ' + item.Sentiment + '</td><td> ' + item.transcript + '</td></tr>';
            }
            datahtml += '</tbody></table></html>'
            res.send(datahtml);
            res.end();
            //res.send(`<h1>Key${data}</h1>`);
        }
    }



    /*
        var items = []


        docClient.query(param, function(err, result) {

            if (err) {
                callback(err);
            } else {

                console.log(result)

                items = items.concat(result.Items);

                if (result.LastEvaluatedKey) {

                    params.ExclusiveStartKey = result.LastEvaluatedKey;
                    queryExecute(callback);
                } else {
                    callback(err, items);
                }
            }
        });
    */

    // queryExecute(callback);
    /*
        var count = 0;
        docClient.scan(param).eachPage((err, data, done) => {
            console.log(data);
            if (data != null) {
                for (let index = 0; index < data.Items.length; index++) {
                    const element = data.Items[index];
                    count++;
                    console.log("TOTAL::> " + count + " ITEM::> " + index + " DATA:: " + JSON.stringify(element));
                }
            } else {
                console.log("Null");
            }
            done();
        });
    */
    /*

    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            console.log(data);
        }
    });
    */

    // Call DynamoDB to read the item from the table
    /*
    ddb.getItem(params, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.Item);
        }
    });
    */

    //    res.send("See the console");
});







app.listen(3001, function() {
    console.log('Example app listening on port 3001!');
});