// import React, { useCallback, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useSocket } from "../Context/SocketProvider";
// import { useNavigate } from "react-router-dom";

// const LobbyScreen = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm();

//   const socket = useSocket();
//   console.log(socket);
//   const navigate = useNavigate();

//   const onSubmit = (data) => {
//     const { email, room } = data;
//     console.log("Inserted Data", data);
//     socket.emit("room:join", { email, room });
//     reset();
//   };

//   const handleJoinRoom = useCallback(
//     (data) => {
//       const { email, room } = data;
//       //for navigating user into room
//       navigate(`/room/${room}`);
//     },
//     [navigate]
//   );

//   useEffect(() => {
//     socket.on("room:join", handleJoinRoom);

//     //off the socket
//     return () => {
//       socket.off("room:join", handleJoinRoom);
//     };
//   }, [socket, handleJoinRoom]);

//   return (
//     <div className="form-container">
//       <h1 className="text-2xl font-bold text-center mb-10">Join Lobby</h1>
//       <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
//         {/* Name Input Field */}
//         <div>
//           <label className="block text-lg font-semibold mb-2">Email</label>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             className="input input-bordered w-full text-base p-2 border border-gray-300 rounded"
//             {...register("email", {
//               required: "Email is required",
//             })}
//           />
//           {errors.email && (
//             <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
//           )}
//         </div>

//         {/* RoomId Input Field */}
//         <div>
//           <label className="block text-lg font-semibold mb-2">Room ID</label>
//           <input
//             type="number"
//             placeholder="Enter your room id"
//             className="input input-bordered w-full text-base p-2 border border-gray-300 rounded"
//             {...register("room", {
//               required: "Room is required",
//             })}
//           />
//           {errors.room && (
//             <p className="text-red-500 text-sm mt-1">{errors.room.message}</p>
//           )}
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//         >
//           Join Lobby
//         </button>
//       </form>
//     </div>
//   );
// };

// export default LobbyScreen;

import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSocket } from "../Context/SocketProvider";
import { useNavigate } from "react-router-dom";

const LobbyScreen = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const socket = useSocket();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    const { email, room } = data;
    console.log("Inserted Data", data);

    // Emit room join request
    socket.emit("room:join", { email, room });
  };

  const handleJoinRoom = useCallback(
    ({ room }) => {
      // Navigate to the room
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);

    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div className="form-container">
      <h1 className="text-2xl font-bold text-center mb-10">Join Lobby</h1>
      <form
        onSubmit={handleSubmit((data) => {
          onSubmit(data);
          reset(); // Reset form only after emitting the event
        })}
        className="flex flex-col gap-4"
      >
        <div>
          <label className="block text-lg font-semibold mb-2">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="input input-bordered w-full text-base p-2 border border-gray-300 rounded"
            {...register("email", {
              required: "Email is required",
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">Room ID</label>
          <input
            type="text"
            placeholder="Enter your room ID"
            className="input input-bordered w-full text-base p-2 border border-gray-300 rounded"
            {...register("room", {
              required: "Room is required",
            })}
          />
          {errors.room && (
            <p className="text-red-500 text-sm mt-1">{errors.room.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Join Lobby
        </button>
      </form>
    </div>
  );
};

export default LobbyScreen;
