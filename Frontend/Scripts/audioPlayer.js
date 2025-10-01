// audioPlayer.js
let currentAudio = null;

export function createWavePlayer(audioSrc, canvas, playBtn, volumeBtn, volumeSlider) {
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = 60;

  const audio = new Audio(audioSrc);
  audio.crossOrigin = "anonymous";

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;

  const gainNode = audioCtx.createGain();
  gainNode.gain.value = volumeSlider?.value || 1;

  const source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  if (volumeSlider) {
    volumeSlider.addEventListener("input", () => {
      gainNode.gain.value = volumeSlider.value;
      volumeBtn.textContent = gainNode.gain.value == 0 ? "🔇" : "🔊";
    });
  }

  playBtn.addEventListener("click", () => {
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      document.querySelector(".play-btn.playing")?.classList.remove("playing");
    }

    if (audio.paused) {
      audioCtx.resume();
      audio.play();
      playBtn.textContent = "⏸";
      playBtn.classList.add("playing");
      currentAudio = audio;
    } else {
      audio.pause();
      playBtn.textContent = "▶";
      playBtn.classList.remove("playing");
      currentAudio = null;
    }
  });

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function drawWave() {
    requestAnimationFrame(drawWave);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let x = 0;
    const sliceWidth = canvas.width / bufferLength;
    ctx.beginPath();

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 255;
      const y = canvas.height / 2 - v * 30;
      ctx.lineTo(x, y);
      x += sliceWidth;
    }

    ctx.strokeStyle = "#ff6a00";
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }

  drawWave();
}
