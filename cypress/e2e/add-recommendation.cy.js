
describe('empty spec', () => {
    it('passes', () => {
        cy.visit('http://localhost:3000/');
        cy.get('#name').type('youtube');
        cy.get('#link').type('youtube');
    });
});
