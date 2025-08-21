# User Management Dashboard (Client)

This is the **React frontend** for the User Management Dashboard.  
It connects to the FeathersJS backend and provides a UI to **list, add, edit, and soft-delete users** with Ant Design components.

---

## 🚀 Features
- React + Vite + Ant Design
- User listing in a table
- Add/Edit user via modal form
- Soft delete (marks deleted=true instead of removing from DB)
- Gender filter (Male/Female/All)
- Success/error toasts with loading states
- Pagination and good UX with AntD components

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/Gaya3ps/user-management-client.git
cd user-management-client
```

Install dependencies:

npm install

⚙️ Configuration

Update the API base URL in src/api.js:

import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3030', // Change to your backend URL if deployed
});

▶️ Running Locally
npm run dev


The app will run at:
👉 http://localhost:5173 (default Vite port)
