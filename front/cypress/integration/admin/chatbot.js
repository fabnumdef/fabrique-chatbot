describe('Testing the chatbot admin page', function () {

  before(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear()
    });
    cy.visit('/auth/login');
    cy.get('[data-cy=EmailInput]').type(Cypress.env('ADMIN_EMAIL'));
    cy.get('[data-cy=PasswordInput]').type(Cypress.env('ADMIN_PASSWORD'));
    cy.get('[data-cy=LoginBtn]').click();

    cy.url().should('include', '/create');
    cy.visit('/admin/chatbot');
  });

  it('should be on the chatbot page', function () {
    cy.get('h1').should('contain', 'Chatbots');
  });
});
