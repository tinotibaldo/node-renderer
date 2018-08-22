# node-renderer
A small threejs project for testing scene directly in node with an accompanying docker file for a VM


# how to run

1 - clone this repo

2 - Use the docker file to build a docker container - Once the container is built mount the files of this path in the src of the 
docker container

2 - npm install in the src of the docker container (the docker container installs headless gl so you don't need to npm install it)

3 - Within the src folder do "npm install -g node-gyp" , then under node_modules/canvas run - node-gyp rebuild you need to 
rebuild the node-gyp npm install

4 node app.js

# how to render ? 

call the init function, inside the init function you can set up the camera

add objects with : 

scene.add(the-objects-you-want-to-render) -> be mindful that I'm adding objects as an example.

then call :

renderAndExport("./image2.png", 200); -> image name an optional timeout

if you are not using textures, there's no need for a timeout

# how to load textures ? 

As loading files is asynchronous in node, you must use the load_texture function.

load_texture('/texture.jpg', texture_cube.material, 'map'); -> path to texture starting from the root ( we calculate the system path inside ), the material where the texture will be applied and the attribute where the texture will be used. In the example we use the texture as the diffuse texture.



