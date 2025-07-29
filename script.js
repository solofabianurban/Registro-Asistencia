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

    fetch("https://script.google.com/macros/s/AKfycbzXSwB3dEwS1v1s8AjPujf13D7TUAmVlgmMhb-Uf-byAzSiua1pkXYkhiArOoeUwIu6FA/exec", {
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
    const selected = cameras.find(camera => camera.id === cameraId);
    if (selected) {
      scanner.start(selected);
    } else {
      console.log('No se pudo iniciar la cámara seleccionada');
    }
  }).catch(function(error) {
    console.error(error);
  });
}
