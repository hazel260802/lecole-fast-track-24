import { useState, useEffect } from "react";
import { getAllUsersAPI, updateSecretPhraseAPI } from "../../../lib/api";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "~/components/ui/table";

interface UsersManagementProps {
  readonly roles: string;
  readonly username: string;
}

interface User {
  username: string;
  roles: string[];
  secret_phrase: string;
}

export default function UsersManagement({ roles, username }: UsersManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsersAPI();
        if (Array.isArray(response)) {
          setUsers(response);
        } else {
          console.error("Unexpected response format:", response);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSecretPhraseChange = async (user: User, newSecretPhrase: string) => {
    if (!newSecretPhrase.trim()) return alert("Secret phrase cannot be empty!");

    try {
      await updateSecretPhraseAPI({ secret_phrase: newSecretPhrase });
      updateUsersSecretPhrase(user.username, newSecretPhrase);
      setSuccessMessage(`Secret phrase updated successfully for user: ${user.username}`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error updating secret phrase:", error);
      alert("Error updating secret phrase!");
    }
  };

  const updateUsersSecretPhrase = (username: string, newSecretPhrase: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.username === username ? { ...u, secret_phrase: newSecretPhrase } : u
      )
    );
  };

  const renderSecretPhraseInput = (user: User) => (
    <div className="flex items-center">
      <input
        type="text"
        value={user.secret_phrase}
        onChange={(e) => {
          const newSecretPhrase = e.target.value;
          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u.username === user.username ? { ...u, secret_phrase: newSecretPhrase } : u
            )
          );
        }}
        className="border rounded p-1 w-full bg-white text-black"
        placeholder="Enter secret phrase"
      />
      <button
        onClick={() => handleSecretPhraseChange(user, user.secret_phrase)}
        className="ml-2 p-1 bg-blue-500 text-white rounded"
      >
        Update
      </button>
    </div>
  );

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">User Table Details</h2>
      {successMessage && <div className="mb-4 text-green-500">{successMessage}</div>}
      <Table>
        <TableHeader className="font-bold text-center">
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Role</TableHead>
            {(roles === "admin" || roles === "user") && <TableHead>Secret Phrase</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.username}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.roles}</TableCell>
              {(roles === "admin" || (roles === "user" && user.username === username)) && (
                <TableCell>{renderSecretPhraseInput(user)}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
