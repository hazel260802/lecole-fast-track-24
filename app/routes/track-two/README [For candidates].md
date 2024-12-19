# Track Two: React RBAC

This track focuses on implementing a React application with RBAC (Role-Based Access Control). The app will include a list of users with roles and secret phrases. The task is to implement real-time updates using sockets, ensure data is loaded efficiently, and securely.

## Requirements:
- Write clean, readable, and maintainable code
- Properly use React hooks for performance optimization
- Structure components in a way that is easy to maintain
- Ensure the UI/UX is intuitive and user-friendly

## Focus Areas:
- Implement an input field for usernames
- Create provider-based access for different user roles (non-authenticated, authenticated, and admin users)
    - Non-authenticated users can only see the list of usernames
    - Authenticated users can see the list of usernames and their roles. They can also update their secret phrase
    - Admin users can see all of the information of all users, and can update the secret phrase of any user
- Display all of the data in a table format
- Use sockets to keep user data updated in real-time
## Implemented Features:
- ✨ **Input field for usernames**: Allows users to enter and search for usernames.
- 🔒 **Provider-based access control**: Differentiates access for non-authenticated, authenticated, and admin users.
- 🔄 **Real-time updates using sockets**: Ensures user data is updated in real-time.
- ⚡ **Efficient data loading and rendering**: Optimizes performance for a smooth user experience.
- 🎨 **User-friendly UI/UX**: Intuitive design for easy navigation and interaction.

## Additional Testing with Postman:
- **Token Implementation**:
    - Ensure to include the token in the `Authorization` header for endpoints that require authentication.
    - Example:
      ```json
      {
        "Authorization": "Bearer <your-token>"
      }
      ```

- **Backend (Node.js)**:
    - Run the backend server using Node.js to handle API requests and socket connections.
    - Example command:
      ```bash
      node server.js
      ```

- **Frontend (Next.js)**:
    - Start the Next.js application to serve the frontend.
    - Example command:
      ```bash
      npm run dev
      ```

Use Postman to send requests to the above endpoints, including the token where necessary, and verify the responses to ensure the application works as expected.
