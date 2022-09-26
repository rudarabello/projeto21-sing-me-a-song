import { faker } from '@faker-js/faker'

beforeEach(() => {
  cy.resetDatabase()
})

describe('Test post on recomendations', () => {
  const recommendation = {
    name: faker.name.firstName(),
    link: faker.internet.url()
  }

  it('add name and link recommendation', () => {
    cy.visit('http://localhost:3000/')
    cy.get('#name').type(recommendation.name)
    cy.get('#link').type('https://www.youtube.com/watch?v=zZlIy3hp0c0&list=PLa75BYTPDNKbhUVggmU3JUEBPibvh0C2t&index=5')
    cy.intercept('POST', 'http://localhost:5000/recommendations').as('newRecommendation')
    cy.get('#submit').click()
    cy.wait('@newRecommendation')
    cy.contains(recommendation.name).should('be.visible')
  })
})
