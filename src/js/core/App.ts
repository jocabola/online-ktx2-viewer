import { fitRectToViewport, WebGLSketch } from '@jocabola/gfx';
import { addFileDropHandler } from '@jocabola/utils';
import { Mesh, MeshBasicMaterial, PlaneBufferGeometry } from 'three';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

const loader = new KTX2Loader();

export class App extends WebGLSketch {
	quad:Mesh;

	constructor() {
		super(window.innerWidth, window.innerHeight, {
			alpha: false,
			antialias: true,
			ortho: true
		});
		this.renderer.setClearColor('black', 1);
		document.body.appendChild(this.domElement);
		this.domElement.className = 'view';

		loader.setTranscoderPath('assets/js/basis/');
		loader.detectSupport(this.renderer);
		// console.log(loader._createTexture);

		this.quad = new Mesh(
			new PlaneBufferGeometry(1, 1, 1, 1),
			new MeshBasicMaterial()
		);
		this.scene.add(this.quad);

		addFileDropHandler(this.domElement, (files) => {
			const file = files[0];
			const reader  = new FileReader();
			reader.addEventListener('load', () => {
				const texture = loader._createTexture(reader.result).then((texture)=>{
					// console.log(texture);
					const siz = texture.source.data;
					// console.log((siz));
					const scl = fitRectToViewport(siz, {
						width: window.innerWidth - 100,
						height: window.innerHeight - 100,
					}, 'contain');
					this.quad.scale.set(
						siz.width * scl,
						siz.height * scl,
						1
					);
					const mat = this.quad.material as MeshBasicMaterial;
					mat.map = texture;
					mat.needsUpdate = true;
				}).catch((error)=>{
					console.error(error);
				});
				
			});

			reader.readAsArrayBuffer(file);
		});
		
		window.addEventListener('resize', (event)=>{
			this.resize(window.innerWidth, window.innerHeight);
		});

		this.camera.position.z = 5;

		this.start();
	}

	update() {
		super.update();
	}
}