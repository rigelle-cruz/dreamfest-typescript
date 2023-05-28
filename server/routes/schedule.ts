import express from 'express'

import { validateDay } from './helpers'
import * as db from '../db'

const router = express.Router()

// GET /schedule/friday
router.get('/:day', async (req, res) => {
  const day = validateDay(req.params.day)

  try {
    const events = await db.getEventsByDay(day)

    const viewData = {
      day,
      events,
    }

    res.render('showDay', viewData)
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
  }
})

export default router
