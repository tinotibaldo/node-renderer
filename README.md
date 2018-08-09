# node-renderer
A small threejs project for testing scene directly in node


# how to run

1 - clone this repo
2 - npm install
3 - node app.js

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



