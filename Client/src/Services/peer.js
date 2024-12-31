// class PeerService {
//   constructor() {
//     if (!this.peer) {
//       this.peer = new RTCPeerConnection({
//         iceServers: [
//           {
//             urls: [
//               "stun:stun.l.google.com:19302",
//               "stun:global.stun.twilio.com:3478",
//             ],
//           },
//         ],
//       });

//       this.remoteStream = null;

//       this.peer.ontrack = (event) => {
//         console.log("Received remote track:", event.streams[0]);
//         this.remoteStream = event.streams[0]; // Save the remote stream
//       };

//       this.peer.oniceconnectionstatechange = () => {
//         console.log("ICE Connection State:", this.peer.iceConnectionState);
//       };

//       this.peer.onsignalingstatechange = () => {
//         console.log("Signaling State:", this.peer.signalingState);
//       };
//     }
//   }

//   async getOffer() {
//     const offer = await this.peer.createOffer();
//     await this.peer.setLocalDescription(new RTCSessionDescription(offer));
//     return offer;
//   }

//   async getAnswer(offer) {
//     await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
//     const answer = await this.peer.createAnswer();
//     await this.peer.setLocalDescription(new RTCSessionDescription(answer));
//     return answer;
//   }

//   async setLocalDescription(ans) {
//     await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
//   }
// }

// export default new PeerService();

class PeerService {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });

      this.remoteStream = null;

      this.peer.ontrack = (event) => {
        console.log("Received remote track:", event.streams[0]);
        this.remoteStream = event.streams[0];
      };
    }
  }

  async getOffer() {
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(new RTCSessionDescription(offer));
    return offer;
  }

  async getAnswer(offer) {
    await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.peer.createAnswer();
    await this.peer.setLocalDescription(new RTCSessionDescription(answer));
    return answer;
  }

  async setLocalDescription(ans) {
    await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
  }
}

export default new PeerService();
