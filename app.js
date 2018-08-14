const fs = require("fs");
const Canvas = require("canvas");
const glContext = require('gl')(1,1); //headless-gl
const getPixels = require("get-pixels");

const THREE = require("three");
global.THREE = THREE;

//a navigator to be used internally
const window = {innerWidth: 64, innerHeight: 64};
global.navigator = require('web-midi-api');
// out tool to export the scene into an image
const pngStream = require('three-png-stream');

let camera, scene, renderer, teximage, canvasGL, target, directional_light, ambient_light, cube, texture_cube;

function init() {

  // GL target
  target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
  canvasGL = new Canvas(window.innerWidth, window.innerHeight);

  // mock function to avoid errors inside THREE.WebGlRenderer()
  canvasGL.addEventListener = function(event, func, bind_) {};

  renderer = new THREE.WebGLRenderer( { preserveDrawingBuffer: true, context: glContext, antialias: false, canvas: canvasGL });
  renderer.setClearColor('green', 1);
  //
  renderer.autoClear = false;
  renderer.clear()

  // near can't be less than 1
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
  camera.position.set( 10, 12, 20 );
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  //////////////////////////////////////////////////////////////////////
  scene = new THREE.Scene();
  // lights
}

function render() {
   renderer.render( scene, camera, target );
}

//
function exportImage(exportPath) {

  console.log("The file was saved!");

  var output = fs.createWriteStream(exportPath)

  pngStream(renderer, target)
    .pipe(output);
}

/// textures needs to be called, that's why we need a delay for now
function renderAndExport(exportPath, delay = 0) {

  const render_call = () => {
    console.log('rendering...');
    render();
    console.log('exporting...');
    //exportImage(exportPath);
	setTimeout(function(){exportImage(exportPath);}, 1000)
    console.log('done');
  };

  if ( delay > 0) {
    console.log('waiting '+delay+' ms in case texture initialization takes time...');
  }

  setTimeout(function(){ render_call(); }, delay);

}

init();


const objects_to_display = () => {

  const obj = new THREE.Object3D();

  directional_light = new THREE.DirectionalLight(0xffffff, 1.2);
  directional_light.position.set(10,10,10);
  obj.add(directional_light);

  ambient_light = new THREE.AmbientLight(0xffffff, 0.2);
  obj.add(ambient_light);
  // untextured purple plane
  let geometry = new THREE.BoxGeometry( 10, 10, 10);
  let material = new THREE.MeshPhongMaterial({ color: 0x0000ff });
  cube = new THREE.Mesh( geometry, material );
  cube.position.z = -20
  cube.rotation.y = Math.PI * 0.25
  obj.add( cube );

  material = new THREE.MeshPhongMaterial({ color : 0xffffff});
  var texture_cube = new THREE.Mesh( geometry, material );
  texture_cube.position.y = 10;
  texture_cube.position.z = -20;
  texture_cube.rotation.y = Math.PI * 0.25;
  texture_cube.scale.set(0.7, -0.7, 0.7);

  obj.add( texture_cube );
/*   load_texture('/texture.jpg', texture_cube.material, 'map'); */
  // TEXTURE LOADERS ////////////////////////////////////////////////////////////////////////
  return obj;

}

scene.add(objects_to_display());
const obj2 = objects_to_display();
obj2.position.x += 20;
scene.add(obj2);

renderAndExport("./image2.png");
