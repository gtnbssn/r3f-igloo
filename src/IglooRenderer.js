// import three.js library from suitable location
import * as THREE from "three";
//import { OrbitControls } from '../controls/OrbitControls.js';

var IglooRenderer = function ( camera, renderer, scene) {

    // 6 perspective cameras for cubemap faces
    var cameraLeft;
    var cameraFront;
    var cameraRight;
    var cameraBack;
    var cameraBottom;
    var cameraTop;

    // look for igloo parameter in URL
    const urlString = window.location.search;
    const urlParams = new URLSearchParams(urlString);
    const igloomode = urlParams.get('igloo');

    // objects from main scene
    this.camera = camera;
    this.renderer = renderer;
    this.scene = scene;
    //this.container = container;

    // object for igloo camera to follow, default is camera object
    var follow_object = null; //camera;

    // pixel ratio
    var pixel_ratio = renderer.getPixelRatio();

    // calculate size of cubemap faces
	var view_width = ( this.renderer.domElement.width / 6 ) / pixel_ratio; 
	var view_height = ( this.renderer.domElement.height ) / pixel_ratio;

    var fov = 90;
    var aspect = 1;
    var near = this.camera.near;
    var far = this.camera.far;

    var pointerX = 0;
    var pointerY = 0;
    var activeCamera = null;

    cameraLeft = new THREE.PerspectiveCamera( fov, aspect, near, far );
    cameraLeft.lookAt( -1, 0, 0 );

    cameraFront = new THREE.PerspectiveCamera( fov, aspect, near, far );
    cameraFront.lookAt( 0, 0, -1 );

    cameraRight = new THREE.PerspectiveCamera( fov, aspect, near, far );
    cameraRight.lookAt( 1, 0, 0 );

    cameraBack = new THREE.PerspectiveCamera( fov, aspect, near, far );
    cameraBack.lookAt(  0, 0, 1  );

    cameraBottom = new THREE.PerspectiveCamera( fov, aspect, near, far );
    cameraBottom.lookAt( 0, -1, 0 );

    cameraTop = new THREE.PerspectiveCamera( fov, aspect, near, far );
    cameraTop.lookAt(  0, 1, 0 );

    // var iglooDiv = document.createElement("div");
    // iglooDiv.id = "iglooDiv";
    // iglooDiv.style = "position:absolute; left:0; top:0; width:100%; height:100%;"
    // var iglooLeftDiv = document.createElement("div");
    // iglooLeftDiv.id = "iglooLeftDiv";
    // iglooLeftDiv.style="position:absolute; left:0%;  top:0; width:16.66667%; height:100%;"
    // var iglooFrontDiv = document.createElement("div");
    // iglooFrontDiv.id = "iglooFrontDiv";
    // iglooFrontDiv.style="position:absolute; left:16.66667%; top:0; width:16.66667%; height:100%;"
    // var iglooRightDiv = document.createElement("div");
    // iglooRightDiv.id = "iglooRightDiv";
    // iglooRightDiv.style="position:absolute; left:33.3333%;  top:0; width:16.66667%; height:100%;"
    // var iglooBackDiv = document.createElement("div");
    // iglooBackDiv.id = "iglooBackDiv";
    // iglooBackDiv.style="position:absolute; left:50%;  top:0; width:16.66667%; height:100%;"
    // var iglooBottomDiv = document.createElement("div");
    // iglooBottomDiv.id = "iglooBottomDiv";
    // iglooBottomDiv.style="position:absolute; left:66.66667%;  top:0; width:16.66667%; height:100%;"
    // var iglooTopDiv = document.createElement("div");
    // iglooTopDiv.id = "iglooTopDiv";
    // iglooTopDiv.style="position:absolute; left:83.3333%;  top:0; width:16.66667%; height:100%;"

    // iglooDiv.appendChild(iglooLeftDiv);
    // iglooDiv.appendChild(iglooFrontDiv);
    // iglooDiv.appendChild(iglooRightDiv);
    // iglooDiv.appendChild(iglooBackDiv);
    // iglooDiv.appendChild(iglooBottomDiv);
    // iglooDiv.appendChild(iglooTopDiv);

    // container.appendChild(iglooDiv);

    // cameraLeft.lookAt( -1, 0, 0 );
    // cameraFront.lookAt( 0, 0, -1 );
    // cameraRight.lookAt( 1, 0, 0 );
    // cameraBack.lookAt(  0, 0, 1  );
    // cameraBottom.lookAt( 0, -1, 0 );
    // cameraTop.lookAt(  0, 1, 0 );
    

    window.addEventListener( 'pointerdown', function ( event ) {

        var clientx = event.clientX % view_width;
        pointerX = (clientx / view_width) * 2 - 1;
        pointerY = - (event.clientY / view_height) * 2 + 1;

        var view_number = Math.floor(event.clientX / view_width);
        switch (view_number) {
            case 0: activeCamera = cameraLeft; break;
            case 1: activeCamera = cameraFront; break;
            case 2: activeCamera = cameraRight; break;
            case 3: activeCamera = cameraBack; break;
            case 4: activeCamera = cameraBottom; break;
            case 5: activeCamera = cameraTop;
        }
    })

    this.update = function() {
        //console.log(this.renderer.domElement.width, this.renderer.domElement.height)
        pixel_ratio = renderer.getPixelRatio();
        view_width = ( this.renderer.domElement.width / 6 ) / pixel_ratio; 
        view_height = ( this.renderer.domElement.height ) / pixel_ratio; 
        near = this.camera.near;
        far = this.camera.far;
    }

    this.enabled = function() {
        if (igloomode == 1) {
            return true;
        }
        else {
            return false;
        }
    }

    this.follow = function(object) {
        follow_object = object;
    }

    this.pointerDownCoords = function() {
        return [pointerX, pointerY];
    }

    this.activeCamera = function() {
        return activeCamera;
    }

    this.render = function() {

        if (igloomode == 1) {

            // Renderer Viewport approach:
            // draw the cubemap faces using Scissors and Viewport methods
            // in WebGLRenderer.

            if (follow_object != null) {
                cameraLeft.position.copy(follow_object.position);
                cameraFront.position.copy(follow_object.position);
                cameraRight.position.copy(follow_object.position);
                cameraBack.position.copy(follow_object.position);
                cameraBottom.position.copy(follow_object.position);
                cameraTop.position.copy(follow_object.position);
            }
            this.renderer.setScissorTest(true);
            this.renderer.setScissor(0, 0, view_width, view_height);
            this.renderer.setViewport(0, 0, view_width, view_height);
            this.renderer.render( this.scene, cameraLeft );

            this.renderer.setScissor(view_width, 0, view_width, view_height);
            this.renderer.setViewport(view_width, 0, view_width, view_height);
            this.renderer.render( this.scene, cameraFront );

            this.renderer.setScissor(view_width * 2, 0, view_width, view_height);
            this.renderer.setViewport(view_width * 2, 0, view_width, view_height);
            this.renderer.render( this.scene, cameraRight );

            this.renderer.setScissor(view_width *  3, 0, view_width, view_height);
            this.renderer.setViewport(view_width * 3, 0, view_width, view_height);
            this.renderer.render( this.scene, cameraBack );

            this.renderer.setScissor(view_width * 4, 0, view_width, view_height);
            this.renderer.setViewport(view_width * 4, 0, view_width, view_height);
            this.renderer.render( this.scene, cameraBottom );

            this.renderer.setScissor(view_width * 5, 0, view_width, view_height);
            this.renderer.setViewport(view_width * 5, 0, view_width, view_height);
            this.renderer.render( this.scene, cameraTop );

            this.renderer.setScissorTest(false);

            return true;
        }
        else {
            return false;
        }
    }
}

export { IglooRenderer };
