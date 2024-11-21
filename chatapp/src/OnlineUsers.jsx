import { Link } from "react-router-dom";
import io from 'socket.io-client';

const OnlineUsers = ({sender, users, setReceiver }) => {
  console.log(users); 
  console.log(sender)
  const socket = io('http://localhost:5000');
  const handleLogout = () => {
    socket.emit('updateStatus', sender._id, 'offline');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/';  
  }
  
  return (
    <div className="w-1/4 h-screen bg-purple-100 p-4 rounded-lg shadow-md flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">
          Users
        </h3>
        <ul className="space-y-2">
          {users && users.length > 0 ? (
            users.map((user) => (
              user._id !== sender._id && 
              <li
                key={user._id}
                className="p-2 bg-white hover:bg-purple-500 hover:text-white rounded-md cursor-pointer transition duration-300"
                onClick={() => setReceiver(user)}
              >
                <div className="flex justify-between items-center">
                  <span>{user.username}</span>
                  <span
                    className={`text-sm font-medium ${
                      user.status === 'online' ? 'text-green-500' : 'text-gray-500'
                    }`}
                  >
                    {user.status === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No users online</li>
          )}
        </ul>
      </div>
      <div className="mt-4" onClick={handleLogout}>
        <Link
          to="/"
          className="block text-center text-xl font-medium text-gray-800 py-2 rounded-md cursor-pointer transition duration-300"
        >
          Logout
        </Link>
      </div>
    </div>
  );
};

export default OnlineUsers;
