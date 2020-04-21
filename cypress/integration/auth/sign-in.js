describe('Testing the login page', function() {

  beforeEach(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear()
    });
    cy.visit('/auth/login');
  })

  it('should have a btn to create an account', function() {
    cy.get('[data-cy=CreateAccount]').click();
    cy.url().should('include', '/auth/sign_up')
  });

  it('should have a btn to reset password', function() {
    cy.get('[data-cy=ForgotPasswordBtn]').click();
    cy.url().should('include', '/auth/forgot_password')
  });

  describe('Login form', () => {
    beforeEach(() => {
      cy.get('[data-cy=EmailInput]').clear();
      cy.get('[data-cy=PasswordInput]').clear();
    })

    it('should disable login btn if the form is not valid', function() {
      cy.get('[data-cy=LoginBtn]').should('be.disabled');

      cy.get('[data-cy=EmailInput]').type('email@example.com');
      cy.get('[data-cy=PasswordInput]').clear();
      cy.get('[data-cy=LoginBtn]').should('be.disabled');

      cy.get('[data-cy=EmailInput]').clear();
      cy.get('[data-cy=PasswordInput]').type('password');
      cy.get('[data-cy=LoginBtn]').should('be.disabled');

      cy.get('[data-cy=EmailInput]').type('emailNotValid');
      cy.get('[data-cy=LoginBtn]').should('be.disabled');
    });

    it('should enable login btn if the form is valid', function() {
      cy.get('[data-cy=EmailInput]').type('email@example.com');
      cy.get('[data-cy=PasswordInput]').type('password');
      cy.get('[data-cy=LoginBtn]').should('be.enabled');
    });

    it('should stay on login page & show error if login is invalid', function() {
      cy.get('[data-cy=EmailInput]').type('email@example.com');
      cy.get('[data-cy=PasswordInput]').type('password');
      cy.get('[data-cy=LoginBtn]').click();

      cy.url().should('include', '/auth/login');
      cy.get('.toast-message').should('contain', 'Mauvais identifiant ou mot de passe.');
    });

    it('should go to create page if login is ok', function() {
      cy.get('[data-cy=EmailInput]').type(Cypress.env('USER_EMAIL'));
      cy.get('[data-cy=PasswordInput]').type(Cypress.env('USER_PASSWORD'));
      cy.get('[data-cy=LoginBtn]').click();

      cy.url().should('include', '/create');
    });
  })
});
