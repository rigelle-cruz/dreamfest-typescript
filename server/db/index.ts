import knexFile from './knexfile'
import knex from 'knex'
import type { Location, LocationData } from '../../models/Location'
import type { Event, EventData, EventWithLocation } from '../../models/Event'

type Environment = 'production' | 'test' | 'development'

const environment = (process.env.NODE_ENV || 'development') as Environment
const config = knexFile[environment]
const db = knex(config)

export async function getAllLocations() {
  return db('locations').select(
    'locations.name as name',
    'locations.description as description',
    'locations.id as id'
  )
}

export async function getEventsByDay(day: string) {
  return db('locations')
    .join('events', 'locations.id', 'events.location_id')
    .select(
      'events.name as eventName',
      'locations.name as locationName',
      'events.description as description',
      'time',
      'day',
      'events.id as id'
    )
    .where('events.day', day)
}

export async function getLocationById(id: number) {
  return db('locations')
    .where('locations.id', id)
    .first()
    .select('name', 'id', 'description')
}

export async function updateLocation(updatedLocation: Location) {
  return db('locations').update(updatedLocation).where('id', updatedLocation.id)
}

export async function addNewEvent(event: Event) {
  const newEvent = {
    location_id: event.location_id,
    day: event.day,
    time: event.time,
    name: event.name,
    description: event.description,
  }
  return db('events').insert(newEvent)
}

export async function deleteEvent(id: number) {
  return db('events').where('id', id).del()
}

export async function getEventsById(id: number) {
  return db('events')
    .select('name', 'id', 'description', 'time', 'day')
    .where('id', id)
    .first()
}

export async function updateEvent(updatedEvent: Event) {
  return db('events').update(updatedEvent).where('id', updatedEvent.id)
}
