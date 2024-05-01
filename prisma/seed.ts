import { prisma } from "../src/lib/prisma"

async function seed() {
    await prisma.event.create({
        data: {
            id: '51fcc204-52a2-4f3f-89c3-09056bf1cf3e',
            title: 'Node Js Event',
            slug: 'node-js-event',
            details: 'Know more about Node Js',
            maximumAttendees: 120
        }
    })
}

seed().then(() => {
    console.log('Seed complete')
    prisma.$disconnect()
 })