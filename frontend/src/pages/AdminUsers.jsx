import { useEffect, useState } from "react";
import api from "../services/axios";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id, newRole) => {
    try {
      await api.put(`/users/${id}/role`, {
        role: newRole,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, role: newRole } : u
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update role");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-10">
        Loading users...
      </div>
    );

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">
        Manage Users
      </h1>

      <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 dark:bg-slate-700">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Assign Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b dark:border-slate-700"
              >
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 capitalize">
                  {user.role}
                </td>

                <td className="p-3">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      updateRole(
                        user._id,
                        e.target.value
                      )
                    }
                    className="
                      px-3 py-2 rounded-md
                      border border-slate-300 dark:border-slate-600
                      bg-white dark:bg-slate-700
                      text-slate-800 dark:text-slate-200
                      focus:outline-none focus:ring-2 focus:ring-indigo-500
                    "
                  >
                    <option value="participant">
                      Participant
                    </option>
                    <option value="organizer">
                      Organizer
                    </option>
                    <option value="volunteer">
                      Volunteer
                    </option>
                    <option value="admin">
                      Admin
                    </option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}