/* =========================================================
   WAVE MOTION SIMULATION
   DIFFERENTIATING y-t AND y-x GRAPHS

   Wave equation:
   y(x,t) = A sin(ωt - kx)

   ω = 2πf
   k = 2π/λ
   v = fλ

   y-t:
   ONE selected particle
   displacement versus time

   y-x:
   ALL particles
   displacement versus distance

   SIMULATION LIMIT:
   60 seconds
   ========================================================= */

"use strict";


/* =========================================================
   1. CONSTANTS
   ========================================================= */

const TWO_PI = Math.PI * 2;

const WAVE_LENGTH = 8;

const PARTICLE_COUNT = 33;

const MAX_TIME = 60;

const YT_WINDOW = 8;


/* =========================================================
   2. SIMULATION VARIABLES
   ========================================================= */

let amplitude = 1.0;

let wavelength = 4.0;

let frequency = 0.5;

let selectedX = 2.0;

let time = 0;

let isPlaying = false;

let lastTime = 0;

let animationSpeed = 1;


/* =========================================================
   3. CANVAS ELEMENTS
   ========================================================= */

const waveCanvas =
    document.getElementById("waveCanvas");

const ytCanvas =
    document.getElementById("ytCanvas");

const yxCanvas =
    document.getElementById("yxCanvas");


const waveCtx =
    waveCanvas.getContext("2d");

const ytCtx =
    ytCanvas.getContext("2d");

const yxCtx =
    yxCanvas.getContext("2d");


/* =========================================================
   4. CONTROL ELEMENTS
   ========================================================= */

const playBtn =
    document.getElementById("playBtn");

const resetBtn =
    document.getElementById("resetBtn");

const freezeBtn =
    document.getElementById("freezeBtn");


const amplitudeSlider =
    document.getElementById("amplitudeSlider");

const wavelengthSlider =
    document.getElementById("wavelengthSlider");

const frequencySlider =
    document.getElementById("frequencySlider");

const particleSlider =
    document.getElementById("particleSlider");


/* =========================================================
   5. DISPLAY ELEMENTS
   ========================================================= */

const amplitudeValue =
    document.getElementById("amplitudeValue");

const wavelengthValue =
    document.getElementById("wavelengthValue");

const frequencyValue =
    document.getElementById("frequencyValue");

const selectedXValue =
    document.getElementById("selectedXValue");

const particlePosition =
    document.getElementById("particlePosition");

const timeDisplay =
    document.getElementById("timeDisplay");

const displacementDisplay =
    document.getElementById("displacementDisplay");

const speedDisplay =
    document.getElementById("speedDisplay");

const ytParticlePosition =
    document.getElementById("ytParticlePosition");

const ytCurrentDisplacement =
    document.getElementById("ytCurrentDisplacement");

const yxTime =
    document.getElementById("yxTime");


/* =========================================================
   6. PHYSICS
   ========================================================= */

function getWaveNumber() {

    return TWO_PI / wavelength;
}


function getAngularFrequency() {

    return TWO_PI * frequency;
}


function getWaveSpeed() {

    return frequency * wavelength;
}


/*
   MAIN WAVE EQUATION

   y(x,t) = A sin(ωt - kx)
*/

function getDisplacement(x, t) {

    const k =
        getWaveNumber();

    const omega =
        getAngularFrequency();


    return amplitude *
        Math.sin(
            omega * t -
            k * x
        );
}


function getSelectedDisplacement() {

    return getDisplacement(
        selectedX,
        time
    );
}


/* =========================================================
   7. CANVAS RESIZING
   ========================================================= */

function resizeCanvas(canvas) {

    const ratio =
        window.devicePixelRatio || 1;


    const width =
        canvas.clientWidth;

    const height =
        canvas.clientHeight;


    canvas.width =
        width * ratio;

    canvas.height =
        height * ratio;


    const ctx =
        canvas.getContext("2d");


    ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );
}


function resizeAllCanvases() {

    resizeCanvas(waveCanvas);

    resizeCanvas(ytCanvas);

    resizeCanvas(yxCanvas);

    drawEverything();
}


/* =========================================================
   8. DISPLAY VALUES
   ========================================================= */

function updateDisplays() {

    const displacement =
        getSelectedDisplacement();


    amplitudeValue.textContent =
        amplitude.toFixed(1);

    wavelengthValue.textContent =
        wavelength.toFixed(1);

    frequencyValue.textContent =
        frequency.toFixed(1);

    selectedXValue.textContent =
        selectedX.toFixed(1);


    particlePosition.textContent =
        selectedX.toFixed(1) + " m";


    timeDisplay.textContent =
        time.toFixed(2) + " s";


    displacementDisplay.textContent =
        displacement.toFixed(2) + " m";


    speedDisplay.textContent =
        getWaveSpeed().toFixed(2) + " m/s";


    ytParticlePosition.textContent =
        selectedX.toFixed(1) + " m";


    ytCurrentDisplacement.textContent =
        displacement.toFixed(2) + " m";


    yxTime.textContent =
        time.toFixed(2) + " s";
}


/* =========================================================
   9. CLEAR CANVAS
   ========================================================= */

function clearCanvas(ctx, canvas) {

    ctx.clearRect(
        0,
        0,
        canvas.clientWidth,
        canvas.clientHeight
    );
}


/* =========================================================
   10. MAIN TRAVELLING WAVE
   ========================================================= */

function drawWave() {

    const width =
        waveCanvas.clientWidth;

    const height =
        waveCanvas.clientHeight;


    clearCanvas(
        waveCtx,
        waveCanvas
    );


    const left = 45;

    const right =
        width - 25;

    const centerY =
        height / 2;

    const waveWidth =
        right - left;

    const scaleX =
        waveWidth / WAVE_LENGTH;

    const scaleY =
        (height * 0.32) / 1.5;


    /* Background */

    waveCtx.fillStyle =
        "#ffffff";

    waveCtx.fillRect(
        0,
        0,
        width,
        height
    );


    /* Equilibrium */

    waveCtx.beginPath();

    waveCtx.moveTo(
        left,
        centerY
    );

    waveCtx.lineTo(
        right,
        centerY
    );

    waveCtx.strokeStyle =
        "#999";

    waveCtx.lineWidth = 1;

    waveCtx.setLineDash([
        6,
        5
    ]);

    waveCtx.stroke();

    waveCtx.setLineDash([]);


    /* Wave */

    waveCtx.beginPath();


    for (
        let px = 0;
        px <= waveWidth;
        px += 2
    ) {

        const x =
            px / scaleX;


        const y =
            getDisplacement(
                x,
                time
            );


        const screenX =
            left + px;

        const screenY =
            centerY -
            y * scaleY;


        if (px === 0) {

            waveCtx.moveTo(
                screenX,
                screenY
            );

        } else {

            waveCtx.lineTo(
                screenX,
                screenY
            );
        }
    }


    waveCtx.strokeStyle =
        "#2563eb";

    waveCtx.lineWidth = 3;

    waveCtx.stroke();


    /* Particles */

    for (
        let i = 0;
        i < PARTICLE_COUNT;
        i++
    ) {

        const x =
            WAVE_LENGTH *
            i /
            (PARTICLE_COUNT - 1);


        const y =
            getDisplacement(
                x,
                time
            );


        const screenX =
            left +
            x * scaleX;


        const screenY =
            centerY -
            y * scaleY;


        const selected =
            Math.abs(
                x - selectedX
            ) < 0.13;


        waveCtx.beginPath();

        waveCtx.arc(
            screenX,
            screenY,
            selected ? 8 : 4,
            0,
            TWO_PI
        );


        if (selected) {

            waveCtx.fillStyle =
                "#18a558";

            waveCtx.strokeStyle =
                "#0b6b38";

            waveCtx.lineWidth = 2;

        } else {

            waveCtx.fillStyle =
                "#555";

            waveCtx.strokeStyle =
                "#333";

            waveCtx.lineWidth = 1;
        }


        waveCtx.fill();

        waveCtx.stroke();


        /* Selected particle guide */

        if (selected) {

            waveCtx.beginPath();

            waveCtx.moveTo(
                screenX,
                centerY
            );

            waveCtx.lineTo(
                screenX,
                screenY
            );


            waveCtx.strokeStyle =
                "#18a558";

            waveCtx.lineWidth = 2;

            waveCtx.setLineDash([
                5,
                4
            ]);

            waveCtx.stroke();

            waveCtx.setLineDash([]);


            waveCtx.fillStyle =
                "#18a558";

            waveCtx.font =
                "bold 14px Arial";

            waveCtx.textAlign =
                "center";


            waveCtx.fillText(
                "Selected particle",
                screenX,
                screenY - 15
            );
        }
    }


    /* Equilibrium label */

    waveCtx.fillStyle =
        "#555";

    waveCtx.font =
        "13px Arial";

    waveCtx.textAlign =
        "left";


    waveCtx.fillText(
        "Equilibrium",
        left + 5,
        centerY - 7
    );


    /* Wave direction */

    const arrowY =
        height - 28;

    const arrowStart =
        width * 0.65;

    const arrowEnd =
        width - 35;


    waveCtx.beginPath();

    waveCtx.moveTo(
        arrowStart,
        arrowY
    );

    waveCtx.lineTo(
        arrowEnd,
        arrowY
    );

    waveCtx.lineTo(
        arrowEnd - 10,
        arrowY - 6
    );

    waveCtx.moveTo(
        arrowEnd,
        arrowY
    );

    waveCtx.lineTo(
        arrowEnd - 10,
        arrowY + 6
    );


    waveCtx.strokeStyle =
        "#222";

    waveCtx.lineWidth = 2;

    waveCtx.stroke();


    waveCtx.fillStyle =
        "#222";

    waveCtx.font =
        "bold 13px Arial";

    waveCtx.textAlign =
        "center";


    waveCtx.fillText(
        "Wave travels →",
        (arrowStart + arrowEnd) / 2,
        arrowY - 8
    );


    /* x-axis */

    const axisY =
        height - 12;


    waveCtx.beginPath();

    waveCtx.moveTo(
        left,
        axisY
    );

    waveCtx.lineTo(
        right,
        axisY
    );


    waveCtx.strokeStyle =
        "#555";

    waveCtx.lineWidth = 1;

    waveCtx.stroke();


    waveCtx.font =
        "12px Arial";

    waveCtx.fillStyle =
        "#555";

    waveCtx.textAlign =
        "center";


    for (
        let x = 0;
        x <= WAVE_LENGTH;
        x++
    ) {

        const screenX =
            left +
            x * scaleX;


        waveCtx.beginPath();

        waveCtx.moveTo(
            screenX,
            axisY
        );

        waveCtx.lineTo(
            screenX,
            axisY + 5
        );

        waveCtx.stroke();


        waveCtx.fillText(
            x + " m",
            screenX,
            axisY + 18
        );
    }


    /* Amplitude */

    const ampX =
        left + 15;

    const ampTop =
        centerY -
        amplitude * scaleY;


    waveCtx.beginPath();

    waveCtx.moveTo(
        ampX,
        centerY
    );

    waveCtx.lineTo(
        ampX,
        ampTop
    );


    waveCtx.strokeStyle =
        "#d97706";

    waveCtx.lineWidth = 2;

    waveCtx.stroke();


    waveCtx.fillStyle =
        "#d97706";

    waveCtx.font =
        "bold 13px Arial";

    waveCtx.textAlign =
        "left";


    waveCtx.fillText(
        "A",
        ampX + 5,
        (centerY + ampTop) / 2
    );
}


/* =========================================================
   11. y-t GRAPH
   ========================================================= */

function drawYTGraph() {

    const width =
        ytCanvas.clientWidth;

    const height =
        ytCanvas.clientHeight;


    clearCanvas(
        ytCtx,
        ytCanvas
    );


    const left = 48;

    const right =
        width - 20;

    const top = 20;

    const bottom =
        height - 35;


    const graphWidth =
        right - left;

    const graphHeight =
        bottom - top;


    ytCtx.fillStyle =
        "#ffffff";

    ytCtx.fillRect(
        0,
        0,
        width,
        height
    );


    /*
       Moving time window.

       Before 8 s:
       0 → 8 s

       After 8 s:
       current time - 8 → current time

       At 60 s:
       52 → 60 s
    */

    let startTime;

    let endTime;


    if (time <= YT_WINDOW) {

        startTime = 0;

        endTime = YT_WINDOW;

    } else {

        startTime =
            time - YT_WINDOW;

        endTime =
            time;
    }


    /* Coordinate conversion */

    function graphX(t) {

        return left +
            (
                (t - startTime) /
                (endTime - startTime)
            ) *
            graphWidth;
    }


    function graphY(y) {

        return (
            top +
            graphHeight / 2 -
            y * (graphHeight / 3)
        );
    }


    /* Grid */

    ytCtx.strokeStyle =
        "#e2e2e2";

    ytCtx.lineWidth = 1;


    const gridStep =
        YT_WINDOW / 8;


    for (
        let i = 0;
        i <= 8;
        i++
    ) {

        const t =
            startTime +
            i * gridStep;


        const x =
            graphX(t);


        ytCtx.beginPath();

        ytCtx.moveTo(
            x,
            top
        );

        ytCtx.lineTo(
            x,
            bottom
        );

        ytCtx.stroke();
    }


    for (
        let y = -1.5;
        y <= 1.5;
        y += 0.5
    ) {

        const screenY =
            graphY(y);


        ytCtx.beginPath();

        ytCtx.moveTo(
            left,
            screenY
        );

        ytCtx.lineTo(
            right,
            screenY
        );

        ytCtx.stroke();
    }


    /* Equilibrium */

    ytCtx.beginPath();

    ytCtx.moveTo(
        left,
        graphY(0)
    );

    ytCtx.lineTo(
        right,
        graphY(0)
    );


    ytCtx.strokeStyle =
        "#888";

    ytCtx.setLineDash([
        5,
        4
    ]);

    ytCtx.stroke();

    ytCtx.setLineDash([]);


    /* Axes */

    ytCtx.strokeStyle =
        "#333";

    ytCtx.lineWidth = 1.5;


    ytCtx.beginPath();

    ytCtx.moveTo(
        left,
        top
    );

    ytCtx.lineTo(
        left,
        bottom
    );

    ytCtx.lineTo(
        right,
        bottom
    );

    ytCtx.stroke();


    /* Wave history */

    ytCtx.beginPath();


    const points = 500;


    for (
        let i = 0;
        i <= points;
        i++
    ) {

        const t =
            startTime +
            (
                (endTime - startTime) *
                i /
                points
            );


        const y =
            getDisplacement(
                selectedX,
                t
            );


        const screenX =
            graphX(t);


        const screenY =
            graphY(y);


        if (i === 0) {

            ytCtx.moveTo(
                screenX,
                screenY
            );

        } else {

            ytCtx.lineTo(
                screenX,
                screenY
            );
        }
    }


    ytCtx.strokeStyle =
        "#2563eb";

    ytCtx.lineWidth = 3;

    ytCtx.stroke();


    /* Current time marker */

    const currentX =
        graphX(time);


    ytCtx.beginPath();

    ytCtx.moveTo(
        currentX,
        top
    );

    ytCtx.lineTo(
        currentX,
        bottom
    );


    ytCtx.strokeStyle =
        "#18a558";

    ytCtx.lineWidth = 2;

    ytCtx.setLineDash([
        5,
        4
    ]);

    ytCtx.stroke();

    ytCtx.setLineDash([]);


    /* Current point */

    const currentY =
        getDisplacement(
            selectedX,
            time
        );


    ytCtx.beginPath();

    ytCtx.arc(
        currentX,
        graphY(currentY),
        6,
        0,
        TWO_PI
    );


    ytCtx.fillStyle =
        "#18a558";

    ytCtx.fill();


    /* Current time label */

    ytCtx.fillStyle =
        "#18a558";

    ytCtx.font =
        "bold 12px Arial";

    ytCtx.textAlign =
        "center";


    ytCtx.fillText(
        "t = " +
        time.toFixed(2) +
        " s",
        currentX,
        top + 14
    );


    /* Axis labels */

    ytCtx.fillStyle =
        "#333";

    ytCtx.font =
        "13px Arial";

    ytCtx.textAlign =
        "center";


    ytCtx.fillText(
        "Time, t (s)",
        (left + right) / 2,
        height - 8
    );


    ytCtx.save();

    ytCtx.translate(
        15,
        (top + bottom) / 2
    );

    ytCtx.rotate(
        -Math.PI / 2
    );


    ytCtx.fillText(
        "Displacement, y (m)",
        0,
        0
    );


    ytCtx.restore();


    /* Time labels */

    ytCtx.textAlign =
        "center";

    ytCtx.font =
        "12px Arial";


    for (
        let i = 0;
        i <= 8;
        i++
    ) {

        const t =
            startTime +
            i * gridStep;


        ytCtx.fillText(
            t.toFixed(1),
            graphX(t),
            bottom + 18
        );
    }


    /* Displacement labels */

    ytCtx.textAlign =
        "right";


    for (
        let y = -1;
        y <= 1;
        y += 0.5
    ) {

        ytCtx.fillText(
            y.toFixed(1),
            left - 7,
            graphY(y) + 4
        );
    }
}


/* =========================================================
   12. y-x GRAPH
   ========================================================= */

function drawYXGraph() {

    const width =
        yxCanvas.clientWidth;

    const height =
        yxCanvas.clientHeight;


    clearCanvas(
        yxCtx,
        yxCanvas
    );


    const left = 48;

    const right =
        width - 20;

    const top = 20;

    const bottom =
        height - 35;


    const graphWidth =
        right - left;

    const graphHeight =
        bottom - top;


    yxCtx.fillStyle =
        "#ffffff";

    yxCtx.fillRect(
        0,
        0,
        width,
        height
    );


    /* Coordinate conversion */

    function graphX(x) {

        return left +
            (x / WAVE_LENGTH) *
            graphWidth;
    }


    function graphY(y) {

        return (
            top +
            graphHeight / 2 -
            y * (graphHeight / 3)
        );
    }


    /* Grid */

    yxCtx.strokeStyle =
        "#e2e2e2";

    yxCtx.lineWidth = 1;


    for (
        let x = 0;
        x <= WAVE_LENGTH;
        x++
    ) {

        const screenX =
            graphX(x);


        yxCtx.beginPath();

        yxCtx.moveTo(
            screenX,
            top
        );

        yxCtx.lineTo(
            screenX,
            bottom
        );

        yxCtx.stroke();
    }


    for (
        let y = -1.5;
        y <= 1.5;
        y += 0.5
    ) {

        const screenY =
            graphY(y);


        yxCtx.beginPath();

        yxCtx.moveTo(
            left,
            screenY
        );

        yxCtx.lineTo(
            right,
            screenY
        );

        yxCtx.stroke();
    }


    /* Equilibrium */

    yxCtx.beginPath();

    yxCtx.moveTo(
        left,
        graphY(0)
    );

    yxCtx.lineTo(
        right,
        graphY(0)
    );


    yxCtx.strokeStyle =
        "#888";

    yxCtx.setLineDash([
        5,
        4
    ]);

    yxCtx.stroke();

    yxCtx.setLineDash([]);


    /* Axes */

    yxCtx.strokeStyle =
        "#333";

    yxCtx.lineWidth = 1.5;


    yxCtx.beginPath();

    yxCtx.moveTo(
        left,
        top
    );

    yxCtx.lineTo(
        left,
        bottom
    );

    yxCtx.lineTo(
        right,
        bottom
    );

    yxCtx.stroke();


    /* Instantaneous wave */

    yxCtx.beginPath();


    for (
        let i = 0;
        i <= 400;
        i++
    ) {

        const x =
            WAVE_LENGTH *
            i /
            400;


        const y =
            getDisplacement(
                x,
                time
            );


        const screenX =
            graphX(x);

        const screenY =
            graphY(y);


        if (i === 0) {

            yxCtx.moveTo(
                screenX,
                screenY
            );

        } else {

            yxCtx.lineTo(
                screenX,
                screenY
            );
        }
    }


    yxCtx.strokeStyle =
        "#f59e0b";

    yxCtx.lineWidth = 3;

    yxCtx.stroke();


    /* Selected particle */

    const selectedScreenX =
        graphX(selectedX);


    const selectedY =
        getSelectedDisplacement();


    yxCtx.beginPath();

    yxCtx.moveTo(
        selectedScreenX,
        top
    );

    yxCtx.lineTo(
        selectedScreenX,
        bottom
    );


    yxCtx.strokeStyle =
        "#18a558";

    yxCtx.lineWidth = 2;

    yxCtx.setLineDash([
        5,
        4
    ]);

    yxCtx.stroke();

    yxCtx.setLineDash([]);


    /* Selected point */

    yxCtx.beginPath();

    yxCtx.arc(
        selectedScreenX,
        graphY(selectedY),
        6,
        0,
        TWO_PI
    );


    yxCtx.fillStyle =
        "#18a558";

    yxCtx.fill();


    /* Axis labels */

    yxCtx.fillStyle =
        "#333";

    yxCtx.font =
        "13px Arial";

    yxCtx.textAlign =
        "center";


    yxCtx.fillText(
        "Distance, x (m)",
        (left + right) / 2,
        height - 8
    );


    yxCtx.save();

    yxCtx.translate(
        15,
        (top + bottom) / 2
    );

    yxCtx.rotate(
        -Math.PI / 2
    );


    yxCtx.fillText(
        "Displacement, y (m)",
        0,
        0
    );


    yxCtx.restore();


    /* x labels */

    yxCtx.textAlign =
        "center";

    yxCtx.font =
        "12px Arial";


    for (
        let x = 0;
        x <= WAVE_LENGTH;
        x++
    ) {

        yxCtx.fillText(
            x.toFixed(0),
            graphX(x),
            bottom + 18
        );
    }


    /* y labels */

    yxCtx.textAlign =
        "right";


    for (
        let y = -1;
        y <= 1;
        y += 0.5
    ) {

        yxCtx.fillText(
            y.toFixed(1),
            left - 7,
            graphY(y) + 4
        );
    }
}


/* =========================================================
   13. DRAW EVERYTHING
   ========================================================= */

function drawEverything() {

    drawWave();

    drawYTGraph();

    drawYXGraph();

    updateDisplays();
}


/* =========================================================
   14. SLIDER CONTROLS
   ========================================================= */

amplitudeSlider.addEventListener(
    "input",
    function () {

        amplitude =
            Number(this.value);

        drawEverything();
    }
);


wavelengthSlider.addEventListener(
    "input",
    function () {

        wavelength =
            Number(this.value);

        drawEverything();
    }
);


frequencySlider.addEventListener(
    "input",
    function () {

        frequency =
            Number(this.value);

        drawEverything();
    }
);


particleSlider.addEventListener(
    "input",
    function () {

        selectedX =
            Number(this.value);

        drawEverything();
    }
);


/* =========================================================
   15. PLAY / PAUSE
   ========================================================= */

playBtn.addEventListener(
    "click",
    function () {

        /*
           Do not allow playing beyond 60 s.
        */

        if (time >= MAX_TIME) {

            time = MAX_TIME;

            isPlaying = false;

            playBtn.textContent =
                "▶ Play";

            drawEverything();

            return;
        }


        isPlaying =
            !isPlaying;


        if (isPlaying) {

            playBtn.textContent =
                "⏸ Pause";


            lastTime =
                performance.now();


            requestAnimationFrame(
                animate
            );

        } else {

            playBtn.textContent =
                "▶ Play";
        }
    }
);


/* =========================================================
   16. RESET
   ========================================================= */

resetBtn.addEventListener(
    "click",
    function () {

        isPlaying = false;

        time = 0;


        playBtn.textContent =
            "▶ Play";


        drawEverything();
    }
);


/* =========================================================
   17. FREEZE
   ========================================================= */

freezeBtn.addEventListener(
    "click",
    function () {

        isPlaying = false;


        playBtn.textContent =
            "▶ Play";


        drawEverything();
    }
);


/* =========================================================
   18. ANIMATION LOOP
   ========================================================= */

function animate(currentTime) {

    if (!isPlaying) {

        return;
    }


    const deltaTime =
        (
            currentTime -
            lastTime
        ) / 1000;


    lastTime =
        currentTime;


    time +=
        deltaTime *
        animationSpeed;


    /*
       HARD 60-SECOND LIMIT
    */

    if (time >= MAX_TIME) {

        time = MAX_TIME;

        isPlaying = false;


        playBtn.textContent =
            "▶ Play";


        drawEverything();


        return;
    }


    drawEverything();


    requestAnimationFrame(
        animate
    );
}


/* =========================================================
   19. PARTICLE SELECTION
   MOUSE + TOUCH
   ========================================================= */

let draggingParticle = false;

let touchStartX = 0;

let touchStartY = 0;


function getParticleXFromScreen(clientX) {

    const rect =
        waveCanvas.getBoundingClientRect();


    const left = 45;

    const right =
        rect.width - 25;


    let x =
        (
            clientX -
            rect.left -
            left
        ) /
        (right - left);


    x *= WAVE_LENGTH;


    return Math.max(
        0,
        Math.min(
            WAVE_LENGTH,
            x
        )
    );
}


/* =========================================================
   MOUSE DOWN
   ========================================================= */

waveCanvas.addEventListener(
    "mousedown",
    function (event) {

        draggingParticle = true;


        selectedX =
            getParticleXFromScreen(
                event.clientX
            );


        particleSlider.value =
            selectedX;


        drawEverything();
    }
);


/* =========================================================
   MOUSE MOVE
   ========================================================= */

window.addEventListener(
    "mousemove",
    function (event) {

        if (!draggingParticle) {

            return;
        }


        selectedX =
            getParticleXFromScreen(
                event.clientX
            );


        particleSlider.value =
            selectedX;


        drawEverything();
    }
);


/* =========================================================
   MOUSE UP
   ========================================================= */

window.addEventListener(
    "mouseup",
    function () {

        draggingParticle = false;
    }
);


/* =========================================================
   TOUCH START
   ========================================================= */

waveCanvas.addEventListener(
    "touchstart",
    function (event) {

        if (
            event.touches.length !== 1
        ) {

            draggingParticle = false;

            return;
        }


        const touch =
            event.touches[0];


        touchStartX =
            touch.clientX;

        touchStartY =
            touch.clientY;


        draggingParticle = true;


        selectedX =
            getParticleXFromScreen(
                touch.clientX
            );


        particleSlider.value =
            selectedX;


        drawEverything();

    },
    {
        passive: true
    }
);


/* =========================================================
   TOUCH MOVE
   ========================================================= */

waveCanvas.addEventListener(
    "touchmove",
    function (event) {

        if (
            event.touches.length !== 1
        ) {

            draggingParticle = false;

            return;
        }


        if (!draggingParticle) {

            return;
        }


        const touch =
            event.touches[0];


        const deltaX =
            Math.abs(
                touch.clientX -
                touchStartX
            );


        const deltaY =
            Math.abs(
                touch.clientY -
                touchStartY
            );


        /*
           Vertical movement:

           release particle control so the page
           can scroll normally.
        */

        if (
            deltaY > deltaX &&
            deltaY > 8
        ) {

            draggingParticle = false;

            return;
        }


        /* Horizontal movement */

        selectedX =
            getParticleXFromScreen(
                touch.clientX
            );


        particleSlider.value =
            selectedX;


        drawEverything();

    },
    {
        passive: true
    }
);


/* =========================================================
   TOUCH END
   ========================================================= */

waveCanvas.addEventListener(
    "touchend",
    function () {

        draggingParticle = false;
    },
    {
        passive: true
    }
);


/* =========================================================
   TOUCH CANCEL
   ========================================================= */

waveCanvas.addEventListener(
    "touchcancel",
    function () {

        draggingParticle = false;
    },
    {
        passive: true
    }
);


/* =========================================================
   20. GRAPH TOUCH BEHAVIOUR
   =========================================================

   No touch handlers are attached to:

   ytCanvas
   yxCanvas

   Therefore the browser handles:

   ✓ Page scrolling
   ✓ Vertical scrolling
   ✓ Horizontal movement
   ✓ Two-finger pinch zoom
   ✓ iPad/iPhone gestures

   ========================================================= */


/* =========================================================
   21. KEYBOARD CONTROL
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "ArrowLeft"
        ) {

            selectedX =
                Math.max(
                    0,
                    selectedX - 0.1
                );


            particleSlider.value =
                selectedX;


            drawEverything();
        }


        if (
            event.key === "ArrowRight"
        ) {

            selectedX =
                Math.min(
                    WAVE_LENGTH,
                    selectedX + 0.1
                );


            particleSlider.value =
                selectedX;


            drawEverything();
        }
    }
);


/* =========================================================
   22. INITIALIZATION
   ========================================================= */

function initialize() {

    amplitudeSlider.value =
        amplitude;

    wavelengthSlider.value =
        wavelength;

    frequencySlider.value =
        frequency;

    particleSlider.value =
        selectedX;


    resizeCanvas(
        waveCanvas
    );

    resizeCanvas(
        ytCanvas
    );

    resizeCanvas(
        yxCanvas
    );


    drawEverything();
}


/* =========================================================
   23. WINDOW RESIZE
   ========================================================= */

window.addEventListener(
    "resize",
    resizeAllCanvases
);


/* =========================================================
   START
   ========================================================= */

initialize();
