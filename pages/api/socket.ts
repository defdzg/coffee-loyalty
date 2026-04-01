import { Server as SocketIOServer } from 'socket.io'
import { Server as HttpServer } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    bodyParser: false,
  },
}

let io: SocketIOServer | null = null

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!io) {
    const httpServer: HttpServer = (res as any).socket.server as HttpServer
    io = new SocketIOServer(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
    })

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)

      socket.on('join', (userId: string) => {
        console.log(`User ${userId} joined room`)
        socket.join(userId)
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
      })
    })
  }

  // Handle POST requests to emit events
  if (req.method === 'POST') {
    const body: any = {}
    req.on('data', (chunk) => {
      Object.assign(body, JSON.parse(chunk.toString()))
    })
    req.on('end', () => {
      if (body.type && body.userId) {
        io?.to(body.userId).emit(body.type, body.data)
        res.status(200).json({ success: true })
      } else {
        res.status(400).json({ error: 'Invalid request' })
      }
    })
  } else {
    res.status(200).json({ success: true })
  }
}
