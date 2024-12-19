import { Server } from "socket.io";
import { db } from "../../database/database.js"; // Import the database instance

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });


  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("update-secret-phrase", (data) => {
      const { userId, newSecretPhrase, actorId } = data;

      db.get("SELECT * FROM users WHERE username = ?", [actorId], (err, actor) => {
        if (err) {
          handleDatabaseError(socket, err);
          return;
        }

        if (!actor) {
          handleActorNotFoundError(socket, actorId);
          return;
        }

        if (actor.roles === "admin" || actorId === userId) {
          updateSecretPhrase(userId, newSecretPhrase, socket, io);
        } else {
          handlePermissionError(socket, actorId, actor.roles);
        }
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
};

const updateSecretPhrase = (userId, newSecretPhrase, socket, io) => {
  db.run(
    "UPDATE users SET secret_phrase = ? WHERE username = ?",
    [newSecretPhrase, userId],
    (err) => {
      if (err) {
        socket.emit("error", { error: "Failed to update secret phrase" });
        console.log(err);
        return;
      }

      io.emit("secret-phrase-updated", { userId, newSecretPhrase });
      socket.emit("success", { message: "Secret phrase updated successfully" });
      console.log("Secret phrase updated successfully");
    }
  );
};

const handleDatabaseError = (socket, err) => {
  socket.emit("error", { error: "Database error" });
  console.log(err);
};

const handleActorNotFoundError = (socket, actorId) => {
  socket.emit("error", { error: `Actor not found: ${actorId}` });
  console.log(`Actor not found: ${actorId}`);
};

const handlePermissionError = (socket, actorId, actorRoles) => {
  socket.emit("error", { error: "You do not have permission to update this user's secret phrase" });
  console.log(`You do not have permission to update this user's secret phrase: ${actorId}, ${actorRoles}`);
};

export default setupSocket ;
