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
import UserPosts from "./pages/UserPost";
import MyPurchases from './pages/MyPurchases';
import Favorites from './pages/Favorites';
import Categories from './pages/Categories';
import CategoryPosts from './pages/CategoryPosts';
import SearchResults from './pages/SearchResults';
import EditPost from './pages/EditPost';
import Register from './components/RegisterForm';
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
          {
            path: '/user-posts',
            element: <UserPosts />,
          },
          {
            path: '/my-purchases',
            element: <MyPurchases />,
          },
          {
            path: '/favorites',
            element: <Favorites />,
          },
          {
            path: '/categories',
            element: <Categories />,
          },
          {
            path: '/categories/:categoryId',
            element: <CategoryPosts />,
          },
          {
            path: '/search',
            element: <SearchResults />,
          },
          {
            path: '/edit-post/:postId',
            element: <EditPost />,
          }
        ],
      },
    ],
  },
  {
    path: '/auth',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
