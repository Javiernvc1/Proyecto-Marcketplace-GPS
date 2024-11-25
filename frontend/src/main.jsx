import ReactDOM from 'react-dom/client';
import App from './routes/App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/Root.jsx';
import ErrorPage from './routes/ErrorPage.jsx';
import Login from './routes/Login.jsx';
import DashboardLayoutBasic from './pages/index.jsx';
import PostsPage from './pages/postpage.jsx';
import Post from './pages/modules/post.jsx';
import CreatePost from './pages/modules/createpost.jsx';
import Chat from "./pages/Chat";
import Conversations from "./pages/Conversations";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <DashboardLayoutBasic />,
        children: [
          {
            path: '/',
            element: <PostsPage />,
          },
          {
            path: '/posts/:id',
            element: <Post />,
          },
          {
            path: '/createpost',
            element: <CreatePost />
          },
          {
            path: '/chat/:conversationId',
            element: <Chat />,
          },
          {
            path: '/conversations',
            element: <Conversations />,
          },
        ],
      },
    ],
  },
  {
    path: '/auth',
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
