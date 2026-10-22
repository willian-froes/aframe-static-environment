/* global AFRAME */
// A-Frame 1.8 no longer includes Cardboard. Render a stereo pair without
// entering a WebXR session, preserving look-controls device orientation.
(() => {
    const scene = document.querySelector('a-scene');
    const panel = document.querySelector('#mobile-vr-controls');
    const button = document.querySelector('#mobile-vr-toggle');
    const status = document.querySelector('#mobile-vr-status');
    if (!AFRAME.utils.device.isMobile() &&
        !AFRAME.utils.device.isMobileDeviceRequestingDesktopSite()) return;

    panel.hidden = false;
    const stereo = new AFRAME.THREE.StereoCamera();
    const size = new AFRAME.THREE.Vector2();
    const viewport = new AFRAME.THREE.Vector4();
    const scissor = new AFRAME.THREE.Vector4();
    stereo.aspect = 0.5;
    let active = false;

    function updateUI() {
        button.textContent = active ? 'Sair do VR' : 'Entrar em VR (Cardboard)';
        button.setAttribute('aria-pressed', String(active));
        status.textContent = active
            ? (window.innerWidth < window.innerHeight
                ? 'Gire o iPhone para a horizontal e desative o bloqueio de rotação.'
                : 'Modo Cardboard ativo. Toque em Sair do VR para voltar.')
            : 'Use o celular na horizontal com um visor Cardboard.';
    }

    function setup() {
        const renderer = scene.renderer;
        const render = renderer.render;
        renderer.render = function (world, camera) {
            if (!active || renderer.xr.isPresenting || camera !== scene.camera ||
                renderer.getRenderTarget()) {
                return render.call(this, world, camera);
            }
            camera.updateWorldMatrix(true, false);
            stereo.update(camera);
            renderer.getSize(size);
            renderer.getViewport(viewport);
            renderer.getScissor(scissor);
            const scissorTest = renderer.getScissorTest();
            const autoClear = renderer.autoClear;
            const half = Math.floor(size.x / 2);
            try {
                renderer.setScissorTest(false);
                renderer.autoClear = false;
                renderer.clear();
                renderer.setScissorTest(true);
                renderer.setViewport(0, 0, half, size.y);
                renderer.setScissor(0, 0, half, size.y);
                render.call(this, world, stereo.cameraL);
                renderer.setViewport(half, 0, size.x - half, size.y);
                renderer.setScissor(half, 0, size.x - half, size.y);
                render.call(this, world, stereo.cameraR);
            } finally {
                renderer.setViewport(viewport);
                renderer.setScissor(scissor);
                renderer.setScissorTest(scissorTest);
                renderer.autoClear = autoClear;
            }
        };
        button.disabled = false;
    }

    button.addEventListener('click', async () => {
        if (active) {
            active = false;
            updateUI();
            return;
        }
        if (!window.isSecureContext) {
            status.textContent = 'Abra este site por HTTPS para habilitar os sensores.';
            return;
        }
        button.disabled = true;
        try {
            if (typeof window.DeviceOrientationEvent === 'undefined') {
                throw new Error('Este navegador não disponibiliza o sensor de orientação. Abra no Safari.');
            }
            if (typeof window.DeviceOrientationEvent.requestPermission === 'function') {
                const permission = await window.DeviceOrientationEvent.requestPermission();
                if (permission !== 'granted') {
                    throw new Error('Acesso à orientação negado. Permita o acesso nas configurações do site e recarregue.');
                }
                scene.components['device-orientation-permission-ui'].permissionGranted = true;
                scene.emit('deviceorientationpermissiongranted');
            }
            active = true;
            updateUI();
        } catch (error) {
            status.textContent = error.message || 'Não foi possível ativar o modo VR. Tente novamente no Safari.';
        } finally {
            button.disabled = false;
        }
    });
    window.addEventListener('resize', updateUI);
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') { active = false; updateUI(); }
    });
    scene.addEventListener('enter-vr', () => {
        active = false;
        panel.hidden = true;
        updateUI();
    });
    scene.addEventListener('exit-vr', () => { panel.hidden = false; });
    if (scene.hasLoaded) setup();
    else scene.addEventListener('loaded', setup, {once: true});
})();
