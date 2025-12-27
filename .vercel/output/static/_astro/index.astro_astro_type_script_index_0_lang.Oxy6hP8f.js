window.addEventListener("load",function(){const s=document.getElementById("bookCanvas");if(!s)return;const v=s.getBoundingClientRect(),i=new THREE.WebGLRenderer({canvas:s,antialias:!0,alpha:!0,powerPreference:"high-performance"});i.setSize(v.width,v.height),i.setPixelRatio(Math.min(window.devicePixelRatio,2)),i.outputEncoding=THREE.sRGBEncoding,i.toneMapping=THREE.ACESFilmicToneMapping,i.toneMappingExposure=1,i.shadowMap.enabled=!0,i.shadowMap.type=THREE.PCFSoftShadowMap;const c=new THREE.Scene,m=new THREE.PerspectiveCamera(28,v.width/v.height,.1,100);m.position.set(0,0,10);const J=new THREE.TextureLoader,H=i.capabilities.getMaxAnisotropy();function b(e){const t=J.load(e);return t.anisotropy=H,t.encoding=THREE.sRGBEncoding,t.minFilter=THREE.LinearMipmapLinearFilter,t.magFilter=THREE.LinearFilter,t.generateMipmaps=!0,t}const K=b("/assets/book-front.png"),O=b("/assets/book-back.png"),Q=b("/assets/book-spine.png"),E=2.5,f=3.5,g=.26,ee=.012,X=.02,n=new THREE.Group,te=E-X*2,F=f-X*2,oe=g-ee*2,u=document.createElement("canvas");u.width=512,u.height=512;const r=u.getContext("2d");r.fillStyle="#f8f4e8",r.fillRect(0,0,512,512);const d=200;for(let e=0;e<d;e++){const t=e/d*512,o=240+Math.random()*15;r.fillStyle=`rgb(${o}, ${o-5}, ${o-15})`,r.fillRect(t,0,512/d,512),r.fillStyle=`rgba(180, 170, 150, ${.2+Math.random()*.3})`,r.fillRect(t,0,.8,512)}const S=r.createLinearGradient(0,0,100,0);S.addColorStop(0,"rgba(200, 180, 140, 0.3)"),S.addColorStop(1,"rgba(200, 180, 140, 0)"),r.fillStyle=S,r.fillRect(0,0,100,512);const Y=new THREE.CanvasTexture(u);Y.anisotropy=H;const p=document.createElement("canvas");p.width=512,p.height=512;const a=p.getContext("2d");a.fillStyle="#f5f1e5",a.fillRect(0,0,512,512);for(let e=0;e<d;e++){const t=e/d*512,o=240+Math.random()*15;a.fillStyle=`rgb(${o}, ${o-5}, ${o-15})`,a.fillRect(0,t,512,512/d),a.fillStyle=`rgba(180, 170, 150, ${.15+Math.random()*.2})`,a.fillRect(0,t,512,.6)}a.fillStyle="rgba(80, 60, 40, 0.5)",a.fillRect(0,0,15,512),a.fillStyle="rgba(100, 80, 60, 0.25)",a.fillRect(15,0,10,512);const $=new THREE.CanvasTexture(p);$.anisotropy=H;const P=new THREE.MeshStandardMaterial({map:Y,roughness:.9,metalness:0,color:16117989}),I=new THREE.MeshStandardMaterial({map:$,roughness:.9,metalness:0,color:16117989}),L=new THREE.CanvasTexture(p);L.rotation=Math.PI,L.center.set(.5,.5);const ne=new THREE.MeshStandardMaterial({map:L,roughness:.95,metalness:0,color:15261904}),C=new THREE.BoxGeometry(te,F,oe,1,1,1),ie=[P,ne,I,I,P,P],k=new THREE.Mesh(C,ie);k.castShadow=!0,k.receiveShadow=!0,n.add(k);const G=(e,t=!1)=>new THREE.ShaderMaterial({uniforms:{map:{value:e},lightPos:{value:new THREE.Vector3(5,8,5)},lightPos2:{value:new THREE.Vector3(-3,4,6)}},vertexShader:`
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            varying vec3 vWorldPosition;
            void main() {
              vUv = uv;
              vNormal = normalize(normalMatrix * normal);
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              vViewPosition = -mvPosition.xyz;
              vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
              gl_Position = projectionMatrix * mvPosition;
            }
          `,fragmentShader:`
            uniform sampler2D map;
            uniform vec3 lightPos;
            uniform vec3 lightPos2;
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            varying vec3 vWorldPosition;

            void main() {
              vec4 texColor = texture2D(map, vUv);
              vec3 color = texColor.rgb;
              float r = color.r, g = color.g, b = color.b;

              // Detect yellow/gold pixels
              float isGold = step(0.55, r) * step(0.4, g) * (1.0 - step(0.55, b));
              float goldAmount = isGold * clamp((r + g - b * 1.5) * 0.9, 0.0, 1.0);

              // Multiple light sources for realism
              vec3 N = normalize(vNormal);
              vec3 V = normalize(vViewPosition);
              vec3 L1 = normalize(lightPos - vWorldPosition);
              vec3 L2 = normalize(lightPos2 - vWorldPosition);
              vec3 H1 = normalize(L1 + V);
              vec3 H2 = normalize(L2 + V);

              float diff1 = max(dot(N, L1), 0.0);
              float diff2 = max(dot(N, L2), 0.0) * 0.5;
              float diff = diff1 + diff2;

              float spec1 = pow(max(dot(N, H1), 0.0), 80.0);
              float spec2 = pow(max(dot(N, H2), 0.0), 40.0) * 0.5;
              float spec = spec1 + spec2;

              float fresnel = pow(1.0 - max(dot(N, V), 0.0), 5.0);

              // Rich gold colors
              vec3 goldBase = vec3(0.92, 0.72, 0.22);
              vec3 goldHighlight = vec3(1.0, 0.92, 0.55);
              vec3 goldReflect = vec3(1.0, 0.85, 0.4);

              // Apply metallic gold to yellow areas
              vec3 result = color;
              result = mix(result, goldBase, goldAmount * 0.45);
              result += goldHighlight * spec * goldAmount * 3.0;
              result += goldReflect * fresnel * goldAmount * 1.2;

              // Matte cover lighting for non-gold areas
              float matteDiff = 0.45 + diff * 0.55;
              result = mix(result * matteDiff, result, goldAmount * 0.5);

              // Subtle specular on cover (laminate effect)
              result += vec3(1.0) * spec * 0.08 * (1.0 - goldAmount);

              gl_FragColor = vec4(result, 1.0);
            }
          `}),ae=new THREE.PlaneGeometry(E,f),z=new THREE.Mesh(ae,G(K));z.position.z=g/2+.001,z.castShadow=!0,n.add(z);const se=new THREE.PlaneGeometry(E,f),w=new THREE.Mesh(se,G(O));w.position.z=-g/2-.001,w.rotation.y=Math.PI,w.castShadow=!0,n.add(w);const B=new THREE.PlaneGeometry(g,f,8,1),A=B.attributes.position;for(let e=0;e<A.count;e++){const t=A.getX(e),o=Math.sin((t/g+.5)*Math.PI)*.015;A.setZ(e,-o)}B.computeVertexNormals();const R=new THREE.Mesh(B,G(Q,!0));R.rotation.y=-Math.PI/2,R.position.x=-E/2,R.castShadow=!0,n.add(R);const x=C.attributes.position;for(let e=0;e<x.count;e++){const t=x.getX(e),o=x.getY(e);if(t>0){const ge=.008*(1-Math.abs(o)/(F/2));x.setX(e,t+ge)}}C.computeVertexNormals(),n.position.set(.1,0,0),n.rotation.set(.1,.5,0),c.add(n);const re=new THREE.AmbientLight(16777215,.5);c.add(re);const l=new THREE.DirectionalLight(16777215,.9);l.position.set(5,8,5),l.castShadow=!0,l.shadow.mapSize.width=2048,l.shadow.mapSize.height=2048,l.shadow.camera.near=.5,l.shadow.camera.far=50,l.shadow.bias=-1e-4,l.shadow.radius=4,c.add(l);const U=new THREE.DirectionalLight(16772829,.4);U.position.set(-3,4,6),c.add(U);const j=new THREE.DirectionalLight(16766720,.25);j.position.set(0,-2,-5),c.add(j);const _=new THREE.DirectionalLight(16774624,.15);_.position.set(0,-3,2),c.add(_);const le=new THREE.PlaneGeometry(6,6),ce=new THREE.ShadowMaterial({opacity:.2}),T=new THREE.Mesh(le,ce);T.rotation.x=-Math.PI/2,T.position.y=-2,T.receiveShadow=!0,c.add(T);let M=!1,V=0,D=0,N=.5,y=.1,h=0;const W=window.innerWidth<=900,q=W?.02:.008,de=W?.01:.004;s.style.cursor="grab",s.style.touchAction="none",s.addEventListener("pointerdown",e=>{M=!0,s.style.cursor="grabbing",V=e.clientX,D=e.clientY,h=0,e.preventDefault()}),window.addEventListener("pointermove",e=>{if(!M)return;const t=e.clientX-V,o=e.clientY-D;N+=t*q,y+=o*de,y=Math.max(-.8,Math.min(.8,y)),h=t*q,V=e.clientX,D=e.clientY}),window.addEventListener("pointerup",()=>{M=!1,s.style.cursor="grab"});function Z(){requestAnimationFrame(Z),!M&&Math.abs(h)>1e-4&&(N+=h,h*=.92);const e=W?.12:.08;n.rotation.y+=(N-n.rotation.y)*e,n.rotation.x+=(y-n.rotation.x)*e,i.render(c,m)}Z(),window.addEventListener("resize",()=>{const e=s.getBoundingClientRect();m.aspect=e.width/e.height,m.updateProjectionMatrix(),i.setSize(e.width,e.height)})});
