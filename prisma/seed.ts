import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

//use createmany to create a bunch of posts filled with mock filler posts with random events

async function posts() {
  await prisma.post.create({
    data: {
      title: 'Im feeling good, went for some ice-cream',
      content: 'Today was a good day, I went for some ice-cream and it was delicious',
    }
  })
  await prisma.post.create({
    data: {
      title: 'I went to the gym',
      content: 'Today I went to the gym and I did some squats',
    }
  })
  await prisma.post.create({
    data: {
      title: 'Did some coding',
      content: 'Today I did some coding and it was fun',
    }
  })
  // await prisma.post.create({
  //   data: {
  //     title: 'I went for a walk',
  //     content: 'Today I went for a walk and it was nice',
  //   }
  // })
  // await prisma.post.create({
  //   data: {
  //     title: 'I went to the beach',
  //     content: 'Today I went to the beach and it was sunny',
  //   }
  // })
}

posts().then(async () => {
  await prisma.$disconnect()

})

.catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})