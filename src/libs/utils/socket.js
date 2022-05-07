import { io } from 'socket.io-client'
import { originalUrl } from '../config';


const socketClient = io(originalUrl, {
  secure: true,
  autoConnect: false,
})

export { socketClient };