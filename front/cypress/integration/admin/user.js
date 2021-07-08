describe('Testing the user admin page', function () {

  before(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear()
    });
    cy.visit('/auth/login');
    cy.get('[data-cy=EmailInput]').type(Cypress.env('ADMIN_EMAIL'));
    cy.get('[data-cy=PasswordInput]').type(Cypress.env('ADMIN_PASSWORD'));
    cy.get('[data-cy=LoginBtn]').click();

    cy.url().should('include', '/create');
    cy.visit('/admin/user');
  });

  it('should be on the user page', function () {
    cy.get('h1').should('contain', 'Utilisateurs');
  });

  it('should list the users', function () {
    // Header + admin e2e + user e2e;
    cy.get('tr').should('have.length.greaterThan', 3);
  });

  it('should disable buttons for current user', function () {
    cy.get('td').contains(Cypress.env('ADMIN_EMAIL')).parent('tr').within(() => {
      cy.get('[data-cy=ChangeRoleBtn]').should('be.disabled');
      cy.get('[data-cy=DeleteBtn]').should('be.disabled');
    });
  });

  it('should be able to change role or delete another user with role user', function () {
    cy.get('td').contains(Cypress.env('USER_EMAIL')).parent('tr').within(() => {
      cy.get('[data-cy=ChangeRoleBtn]').should('be.enabled');
      cy.get('[data-cy=DeleteBtn]').should('be.enabled');
    });
  });

  it('should change user role', function () {
    cy.get('td').contains(Cypress.env('USER_EMAIL')).parent('tr').within(() => {
      cy.get('[data-cy=ChangeRoleBtn]').click();
    });
    cy.intercept('PUT', '**/user/**').as('updateUser');
    cy.get('[data-cy=ConfirmBtn]').click();
    cy.wait('@updateUser');

    cy.get('td').contains(Cypress.env('USER_EMAIL')).parent('tr').within(() => {
      cy.get('[data-cy=DeleteBtn]').should('be.disabled');
    });

    cy.get('td').contains(Cypress.env('USER_EMAIL')).parent('tr').within(() => {
      cy.get('[data-cy=ChangeRoleBtn]').click();
    });
    cy.get('[data-cy=ConfirmBtn]').click();
    cy.wait('@updateUser');

    cy.get('td').contains(Cypress.env('USER_EMAIL')).parent('tr').within(() => {
      cy.get('[data-cy=DeleteBtn]').should('be.enabled');
    });
  });
});
