import { RouterProvider } from 'react-router';
import { router } from './router';
import './assets/style.css';
import MessageToast from './Components/MessageToast';

function App() {
  return (
    <>
      <MessageToast />
      <RouterProvider router={router} />
    </>
  );
}
export default App;
