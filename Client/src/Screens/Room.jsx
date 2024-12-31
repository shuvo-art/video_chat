// import React, { useCallback, useEffect, useState } from "react";
// import { useSocket } from "../Context/SocketProvider";
// import peer from "../Services/Peer";

// const Room = () => {
//   const [remoteSocketId, setRemoteSocketId] = useState(null);
//   const [myStream, setMyStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null); // State to handle remote stream

//   const socket = useSocket();

//   // Handle when a user joins the room
//   const handleUserJoined = useCallback(({ email, id }) => {
//     console.log(`User joined: Email - ${email}, ID - ${id}`);
//     setRemoteSocketId(id);
//   }, []);

//   // Start a call to another user
//   const handleCallUser = useCallback(async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//       video: false,
//     });

//     // Add local tracks to the peer connection
//     stream.getTracks().forEach((track) => {
//       peer.peer.addTrack(track, stream);
//     });

//     const offer = await peer.getOffer();
//     console.log(`Calling user ${remoteSocketId} with offer:`, offer);

//     socket.emit("user:call", { to: remoteSocketId, offer });
//     setMyStream(stream);
//   }, [remoteSocketId, socket]);

//   // Handle incoming call
//   const handleIncommingCall = useCallback(
//     async ({ from, offer }) => {
//       console.log(`Incoming call from: ${from}`);
//       setRemoteSocketId(from);

//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//         video: false,
//       });

//       // Add local tracks to the peer connection
//       stream.getTracks().forEach((track) => {
//         peer.peer.addTrack(track, stream);
//       });

//       setMyStream(stream);

//       const answer = await peer.getAnswer(offer); // Respond with an answer
//       socket.emit("call:accepted", { to: from, ans: answer });
//     },
//     [socket]
//   );

//   // Handle when the call is accepted
//   const handleCallAccepted = useCallback(({ from, ans }) => {
//     console.log(`Call accepted by: ${from}`);
//     peer.setLocalDescription(ans);

//     // Set the remote stream when available
//     setRemoteStream(peer.remoteStream);
//   }, []);

//   // Listen for WebRTC and signaling events
//   useEffect(() => {
//     socket.on("user:joined", handleUserJoined);
//     socket.on("incomming:call", handleIncommingCall);
//     socket.on("call:accepted", handleCallAccepted);

//     return () => {
//       socket.off("user:joined", handleUserJoined);
//       socket.off("incomming:call", handleIncommingCall);
//       socket.off("call:accepted", handleCallAccepted);
//     };
//   }, [socket, handleUserJoined, handleIncommingCall, handleCallAccepted]);

//   return (
//     <div className="text-center mt-40">
//       <h1 className="text-3xl mb-5">Room</h1>
//       <h1 className="mb-2">
//         {remoteSocketId ? "Connected" : "No one in the room"}
//       </h1>

//       {remoteSocketId && (
//         <button
//           onClick={handleCallUser}
//           className="px-5 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white"
//         >
//           Call
//         </button>
//       )}

//       {myStream && (
//         <div className="mt-5">
//           <h2 className="text-lg font-semibold mb-2">Your Stream</h2>
//           <video
//             playsInline
//             muted
//             autoPlay
//             ref={(video) => {
//               if (video) {
//                 video.srcObject = myStream;
//               }
//             }}
//             style={{ width: "200px", height: "200px", borderRadius: "8px" }}
//           />
//         </div>
//       )}

//       {remoteStream && (
//         <div className="mt-5">
//           <h2 className="text-lg font-semibold mb-2">Remote Stream</h2>
//           <video
//             playsInline
//             autoPlay
//             ref={(video) => {
//               if (video) {
//                 video.srcObject = remoteStream;
//               }
//             }}
//             style={{ width: "200px", height: "200px", borderRadius: "8px" }}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Room;

import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../Context/SocketProvider";
import peer from "../Services/Peer";

const Room = () => {
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const socket = useSocket();

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`User joined: Email - ${email}, ID - ${id}`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    stream.getTracks().forEach((track) => {
      peer.peer.addTrack(track, stream);
    });

    const offer = await peer.getOffer();
    console.log(`Calling user ${remoteSocketId} with offer:`, offer);

    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      console.log(`Incoming call from: ${from}`);
      setRemoteSocketId(from);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      stream.getTracks().forEach((track) => {
        peer.peer.addTrack(track, stream);
      });

      setMyStream(stream);

      const answer = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans: answer });
    },
    [socket]
  );

  const handleCallAccepted = useCallback(({ from, ans }) => {
    console.log(`Call accepted by: ${from}`);
    peer.setLocalDescription(ans);

    setRemoteStream(peer.remoteStream);
  }, []);

  useEffect(() => {
    peer.peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          to: remoteSocketId,
          candidate: event.candidate,
        });
      }
    };

    socket.on("ice-candidate", ({ from, candidate }) => {
      console.log(`Received ICE candidate from: ${from}`);
      peer.peer
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch(console.error);
    });

    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);

    return () => {
      socket.off("ice-candidate");
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    remoteSocketId,
  ]);

  return (
    <div className="text-center mt-40">
      <h1 className="text-3xl mb-5">Room</h1>
      <h1 className="mb-2">
        {remoteSocketId ? "Connected" : "No one in the room"}
      </h1>

      {remoteSocketId && (
        <button
          onClick={handleCallUser}
          className="px-5 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white"
        >
          Call
        </button>
      )}

      {myStream && (
        <div className="mt-5">
          <h2 className="text-lg font-semibold mb-2">Your Stream</h2>
          <video
            playsInline
            muted
            autoPlay
            ref={(video) => {
              if (video) {
                video.srcObject = myStream;
              }
            }}
            style={{ width: "200px", height: "200px", borderRadius: "8px" }}
          />
        </div>
      )}

      {remoteStream && (
        <div className="mt-5">
          <h2 className="text-lg font-semibold mb-2">Remote Stream</h2>
          <video
            playsInline
            autoPlay
            ref={(video) => {
              if (video) {
                video.srcObject = remoteStream;
              }
            }}
            style={{ width: "200px", height: "200px", borderRadius: "8px" }}
          />
        </div>
      )}
    </div>
  );
};

export default Room;
