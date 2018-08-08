var fs = require("fs");
var path = require("path");
var Canvas = require("canvas");
var glContext = require('gl')(1,1); //headless-gl
var THREE = require("three");
var request = require('request');

var equi, camera, scene, renderer, teximage;

var window = {innerWidth: 1000, innerHeight: 1000};
var LOAD_TEXTURE_USING_HTTP = false;

global.navigator = require('web-midi-api');
global.THREE = THREE;
var pngStream = require('three-png-stream')


// http://stackoverflow.com/a/14855016/2207790
var loadTextureHTTP = function (url, callback) {
  require('request')({
    method: 'GET', url: url, encoding: null
  }, function(error, response, body) {
    if(error) throw error;

    console.log('body:', body.length);

    var image = new Canvas.Image;
    image.src = body;

    var texture = new THREE.Texture(image);
    texture.needsUpdate = true;

    teximage = image;
    if (callback) callback(texture);
  });
};

var canvasGL
var target

function init() {
  // GL scene renderer
  target = new THREE.WebGLRenderTarget(512, 512)
  canvasGL = new Canvas(window.innerWidth, window.innerHeight);

  // mock function to avoid errors inside THREE.WebGlRenderer()
  canvasGL.addEventListener = function(event, func, bind_) {};

  renderer = new THREE.WebGLRenderer( { preserveDrawingBuffer: true, context: glContext, antialias: false, canvas: canvasGL });
  renderer.setClearColor(0xff0000, 1)
  //renderer.setSize(1000,1000)
  renderer.autoClear = false;
  renderer.clear()

  // camera
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.set( 1,1, 100 );
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  //////////////////////////////////////////////////////////////////////
  scene = new THREE.Scene();

  // untextured purple plane
  var geometry = new THREE.BoxGeometry( 500, 200, 32 );
  var material = new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide} );
  var plane = new THREE.Mesh( geometry, material );
  plane.position.z = -3;
  scene.add( plane );

  material = new THREE.MeshBasicMaterial({color : 0xffffff, side: THREE.DoubleSide});
  var plane2 = new THREE.Mesh( geometry, material );
  plane2.position.z = 10;
  scene.add( plane2 );
  plane2.scale.set(.5,-.5,.5)

  // TEXTURE LOADERS ////////////////////////////////////////////////////////////////////////
  var getPixels = require("get-pixels")

  getPixels(__dirname+'/asd.jpg', function(err, pixels) {

      if(err) {
        console.log("Failed to load texture using get-pixels:", err);
        return;
      }

      var texture = new THREE.DataTexture( new Uint8Array(pixels.data), pixels.shape[0], pixels.shape[1], THREE.RGBAFormat );

      texture.needsUpdate = true;

      plane2.material.map = texture;

    });

}

function render() {
   renderer.render( scene, camera, target );
  //var canv = equi.updateAndGetCanvas( camera, scene );

  // overlay texture's source image on the canvas to verify image was loaded properly
  //canv.getContext('2d').drawImage(teximage, 0, 0, 1024, 512);
}

function exportImage(exportPath) {
  var dataURL = renderer.domElement.toDataURL();//canvasGL.toDataURL();

  //console.log(dataURL);

  var dataURL = dataURL.replace(/^data:image\/png;base64,/, "");

    //fs.writeFile(exportPath, dataURL, function(err) {
    //if(err) {
    //    return console.log(err);
    //}
    //}); 

    var buf = canvasGL.toBuffer();
    //fs.writeFileSync("./test.png", buf);

    console.log("The file was saved!");

var output = fs.createWriteStream('./image.png')

pngStream(renderer, target)
  .pipe(output);

  //var canvasStream = equi.canvas.pngStream();
  //canvasStream.on("data", function (chunk) { out.write(chunk); });
  //canvasStream.on("end", function () { console.log("done"); });
}

function renderAndExport(exportPath, delay) {
  var func = function() {
    console.log('rendering...');
    render();
    console.log('exporting...');
    setTimeout(function(){ exportImage(exportPath) }, delay);

    
    console.log('done');
  };

  if (delay !== undefined) {
    console.log('waiting '+delay+' ms in case texture initialization takes time...');
    setTimeout(function(){ func(); }, delay);
  } else {
    func();
  }
}

init();

renderAndExport("./three-plane-equi.png", 2000);
