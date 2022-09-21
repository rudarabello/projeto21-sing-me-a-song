import { faker } from "@faker-js/faker";

describe('Test post on recomendations', () => {

    before(() => {
        cy.request('POST', 'http://localhost:3000/e2e/truncate', {})
    })
    const recommendation = {
        name: faker.name.firstName(),
        link: faker.internet.url(),
    };

    it('add name and link', () => {
        cy.visit('http://localhost:3000/');
        cy.get('#name').type(recommendation.name);
        cy.get('#link').type('https://www.youtube.com/watch?v=zZlIy3hp0c0&list=PLa75BYTPDNKbhUVggmU3JUEBPibvh0C2t&index=5');
        cy.get('#submit').click();
    });
});
