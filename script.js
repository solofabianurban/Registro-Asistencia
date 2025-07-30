let selectedCamera = null;

navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    selectedCamera = devices.find(device => device.kind === 'videoinput');
    if (selectedCamera) {
      iniciarEscaneo(selectedCamera.deviceId);
    } else {
      console.log('No se encontró cámara.');
    }
  })
  .catch(err => console.error('Error enumerando dispositivos:', err));

function iniciarEscaneo(cameraId) {
  const scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
  scanner.addListener('scan', function(content) {
    document.getElementById("mensaje").textContent = "Registrando asistencia...";

    fetch("https://script.google.com/macros/s/AKfycbyaB2VWeEAspx47_JoTrSKTAZLwizzITTrb11e2pJ624PckIiQbSWVFKTVXFH9ZsIHb8w/exec", {
      method: "POST",
      body: JSON.stringify({ nombre: content }),
      headers: { "Content-Type": "application/json" }
    })
    .then(res => res.text())
    .then(data => {
      console.log("Asistencia registrada:", data);
      document.getElementById("mensaje").textContent = "¡Asistencia registrada!";
    })
    .catch(err => {
      console.error("Error al registrar:", err);
      document.getElementById("mensaje").textContent = "Error al registrar asistencia.";
    });
  });

  Instascan.Camera.getCameras().then(function(cameras) {
    const html5QrCode = new Html5Qrcode("reader");
  html5QrCode.start(
  { facingMode: "environment" }, // usa la cámara trasera
  {
    fps: 10,
    qrbox: { width: 250, height: 250 }
  },
  onScanSuccess,
  onScanFailure
).catch(err => {
  console.error("Error al iniciar el escáner:", err);
});

}
