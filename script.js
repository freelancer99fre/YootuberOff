const entrarBtn = document.getElementById('entrar');
const videoContainer = document.getElementById('video-container');
const video = document.getElementById('video');
const videoRemote = document.getElementById('video-remote');
const compartilharBtn = document.getElementById('compartilhar');
const desconectarBtn = document.getElementById('desconectar');

// Variáveis para WebRTC
let localStream;
let remoteStream;
let peerConnection;
let mediaConstraints = { video: true, audio: true };

entrarBtn.addEventListener('click', () => {
    iniciarChamada();
});

compartilharBtn.addEventListener('click', () => {
    compartilharTela();
});

desconectarBtn.addEventListener('click', () => {
    desconectarChamada();
});

async function iniciarChamada() {
    try {
        // Captura do vídeo local
        localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
        video.srcObject = localStream;

        // Criando a conexão peer (comunicação P2P)
        peerConnection = new RTCPeerConnection();

        // Enviando as tracks de vídeo e áudio para o peer
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        // Exibindo a interface de vídeo
        videoContainer.classList.remove('hidden');
        entrarBtn.style.display = 'none';

        // Criando a oferta de conexão (SDP) para o outro peer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // Aqui, normalmente, você precisaria enviar a oferta via sinalização (como um servidor)
        // Para fins de demonstração, vamos simular recebendo uma resposta de um outro peer
        setTimeout(() => {
            // Simulando o recebimento de uma resposta (SDP)
            peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            peerConnection.createAnswer().then(answer => {
                peerConnection.setLocalDescription(answer);
            });
        }, 1000);

        // Recebendo o stream remoto (quando o outro peer envia seu stream)
        peerConnection.ontrack = (event) => {
            remoteStream = event.streams[0];
            videoRemote.srcObject = remoteStream;
        };
    } catch (error) {
        console.error('Erro ao acessar o dispositivo de mídia:', error);
    }
}

async function compartilharTela() {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true
        });
        const track = stream.getTracks()[0];
        const sender = peerConnection.getSenders().find(s => s.track.kind === track.kind);
        if (sender) {
            sender.replaceTrack(track);
        }
        video.srcObject = stream;
    } catch (error) {
        console.error('Erro ao compartilhar a tela:', error);
    }
}

function desconectarChamada() {
    if (peerConnection) {
        peerConnection.close();
    }
    localStream.getTracks().forEach(track => track.stop());
    videoContainer.classList.add('hidden');
    entrarBtn.style.display = 'block';
}
