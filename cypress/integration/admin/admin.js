describe('Testing the admin access', function() {

  beforeEach(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear()
    });
    cy.visit('/auth/login');
  });

  it('should not show admin button if user is not admin & should not have access to admin page', function() {
    cy.get('[data-cy=EmailInput]').type(Cypress.env('USER_EMAIL'));
    cy.get('[data-cy=PasswordInput]').type(Cypress.env('USER_PASSWORD'));
    cy.get('[data-cy=LoginBtn]').click();

    cy.url().should('include', '/create');
    cy.get('[data-cy=AdminBtn]').should('not.exist');

    cy.visit('/admin');
    cy.url().should('not.include', '/admin');
  });

  it('should show admin button if the user is admin & should have access to admin page', function() {
    cy.get('[data-cy=EmailInput]').type(Cypress.env('ADMIN_EMAIL'));
    cy.get('[data-cy=PasswordInput]').type(Cypress.env('ADMIN_PASSWORD'));
    cy.get('[data-cy=LoginBtn]').click();

    cy.url().should('include', '/create');
    cy.get('[data-cy=AdminBtn]').should('exist');

    cy.visit('/admin');
    cy.url().should('include', '/admin');
  });
});
