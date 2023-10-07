import './App.css'
import UserAuth from './components/Registration/UserAuth'
import './index.css'
import { useState } from 'react'
import Alert from '@mui/material/Alert';

function App() {

  const [notification, setNotification] = useState<string>("")
  const [statusNotification, setStatusNotification] = useState<string>("")

  const NOTIFICATION_TYPES = {
    SUCCESS: "success",
    ERROR: "error"
  }

  return (
      <div className=''>
        {statusNotification===NOTIFICATION_TYPES.SUCCESS && <Alert severity="success" variant="outlined" >{notification}</Alert>}
        {statusNotification===NOTIFICATION_TYPES.ERROR && <Alert severity="error" variant="outlined" >{notification}</Alert>}
        <UserAuth setNotification={setNotification} setStatusNotification={setStatusNotification} />
      </div>
  )
}

export default App
