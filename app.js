var THREE = require("three");
var fs = require("fs");
var savePixels = require("save-pixels")
var ndarray = require("ndarray")

// Create a DOM
var MockBrowser = require('mock-browser').mocks.MockBrowser;
var mock = new MockBrowser();
var document = MockBrowser.createDocument();
//REST API
var express     = require('express');      
var app         = express();    
var bodyParser  = require('body-parser');
var router = express.Router();
global.navigator = require('web-midi-api');
global.THREE = THREE;

	
var width   = 128
var height  = 128

var pngStream = require('three-png-stream');
var port = process.env.PORT || 8080;
var Canvas = require("canvas");

var window = {innerWidth: width, innerHeight: height};

THREE.document = document;
window.document = document;
global.document = document;
global.window = window;
app.get('/render', function(req, res){

  canvasGL = new Canvas(window.innerWidth, window.innerHeight);
  canvasGL.addEventListener = function(event, func, bind_) {}; // mock function to avoid errors inside THREE.WebGlRenderer()

	var gl = require('gl')(width, height, { preserveDrawingBuffer: true, canvas: canvasGL })
	var document = MockBrowser.createDocument();

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({context:gl});

    renderer.setSize(this.width, this.height);
    renderer.setClearColor(0xFFFF00, 1);
  renderer.autoClear = false;
  renderer.clear()

    camera.position.z = 10;
    scene.add(camera);


  //var geometry = new THREE.BoxGeometry( 10, 10, 10, 1,1,1 );
  //var material = new THREE.MeshBasicMaterial( {color: 0x123456, side: THREE.DoubleSide} );
  //var plane = new THREE.Mesh( geometry, material );
  //scene.add(plane)
  //camera.lookAt(plane)


    var target = new THREE.WebGLRenderTarget(this.width, this.height);

   renderer.render(scene, camera);
   //res.setHeader('Content-Type', 'image/png');
   //pngStream(renderer, target).pipe(res);

	var pixels = new Uint8Array(width * height * 4)

   gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

   	//console.log(renderer.domElement)
  	setTimeout( function() {


var dataURL = canvasGL.toDataURL("image/png");//canvasGL.toDataURL();

									//data:image/png;base64,
  	var dataURL = dataURL.replace(/^data:image\/png;base64,/, "");

   	 fs.writeFile('./asd3.png', dataURL, function(err) {
   	console.log(dataURL)

    if(err) {
        return console.log(err);
    }
    }); 

	process.stdout.write(['P3\n# gl.ppm\n', width, " ", height, '\n255\n'].join(''))
	for(var i=0; i<pixels.length; i+=4) {
	  for(var j=0; j<3; ++j) {

	    //process.stdout.write(pixels[i+j] + ' ')
	  }
	}
	//ndarray(gl.RGBA, [window.innerHeight, window.innerWidth]);

	//savePixels([pixels], "png").pipe(process.stdout)

    var img = new Buffer(dataURL, 'base64');
    console.log(img)


   res.writeHead(200, {
     'Content-Type': 'image/png',
     'Content-Length': img.length
   });
   res.end(img);


  	}, 1000)
  	

   });
/*
app.get('/render', function(req, res){
	
var width   = 64
var height  = 64
var gl = require('gl')(width, height, { preserveDrawingBuffer: true })

//Clear screen to red
gl.clearColor(1, 0, 0, 1)
gl.clear(gl.COLOR_BUFFER_BIT)

//Write output as a PPM formatted image
var pixels = new Uint8Array(width * height * 4)
gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
process.stdout.write(['P3\n# gl.ppm\n', width, " ", height, '\n255\n'].join(''))
for(var i=0; i<pixels.length; i+=4) {
  for(var j=0; j<3; ++j) {
    process.stdout.write(pixels[i+j] + ' ')
  }
}
});
*/
//app.use('/api', router);

app.listen(port);
console.log('Server active on port: ' + port);