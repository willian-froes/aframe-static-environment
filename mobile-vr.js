/* global AFRAME */
// A-Frame 1.8 no longer includes Cardboard. Render a stereo pair without
// entering a WebXR session, preserving look-controls device orientation.
(() => {
    const scene = document.querySelector('a-scene');
    if (!AFRAME.utils.device.isMobile() &&
        !AFRAME.utils.device.isMobileDeviceRequestingDesktopSite()) return;

    const stereo = new AFRAME.THREE.StereoCamera();
    const size = new AFRAME.THREE.Vector2();
    const viewport = new AFRAME.THREE.Vector4();
    const scissor = new AFRAME.THREE.Vector4();
    stereo.aspect = 0.5;
    let active = false;

    let ready = false;
    let fullscreenPending = false;
    let ownsFullscreen = false;
    const landscape = window.matchMedia('(orientation: landscape)');

    function isLandscape() {
        // Screen orientation is unaffected by the keyboard or Safari toolbars.
        if (window.screen.orientation?.type) {
            return window.screen.orientation.type.startsWith('landscape');
        }
        if (typeof window.orientation === 'number') {
            return Math.abs(window.orientation) === 90;
        }
        return landscape.matches;
    }

    async function requestFullscreen() {
        if (!active || fullscreenPending || document.fullscreenElement ||
            !document.fullscreenEnabled || !document.documentElement.requestFullscreen) return;
        fullscreenPending = true;
        try {
            await document.documentElement.requestFullscreen({navigationUI: 'hide'});
            ownsFullscreen = true;
            // The device may have returned to portrait while the request was pending.
            syncOrientation();
        } catch {
            // Rotation alone does not grant user activation. A tap on the canvas
            // retries on supported browsers; installed web apps already fill the screen.
        } finally {
            fullscreenPending = false;
        }
    }

    function syncOrientation() {
        const wasActive = active;
        active = ready && isLandscape() && !scene.is('vr-mode');
        document.documentElement.classList.toggle('cardboard-active', active);
        if (active && !wasActive) requestFullscreen();
        if (!active && ownsFullscreen && document.fullscreenElement) {
            ownsFullscreen = false;
            document.exitFullscreen().catch(() => {});
        }
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
        ready = true;
        syncOrientation();
    }

    window.addEventListener('resize', syncOrientation);
    window.addEventListener('orientationchange', syncOrientation);
    window.screen.orientation?.addEventListener('change', syncOrientation);
    landscape.addEventListener('change', syncOrientation);
    // No controls cover the lenses. A canvas tap can enable browser fullscreen.
    scene.addEventListener('click', (event) => {
        if (event.target === scene.canvas) requestFullscreen();
    });
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) ownsFullscreen = false;
        syncOrientation();
    });
    scene.addEventListener('enter-vr', syncOrientation);
    scene.addEventListener('exit-vr', syncOrientation);
    if (scene.hasLoaded) setup();
    else scene.addEventListener('loaded', setup, {once: true});
})();
