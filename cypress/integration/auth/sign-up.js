describe('Testing the Sign Up page', function() {

  beforeEach(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear()
    });
    cy.visit('/auth/sign_up');
  });

  it('should have a btn to login', function() {
    cy.get('[data-cy=LoginBtn]').click();
    cy.url().should('include', '/auth/login');
  });

  describe('Create Account form', () => {
    beforeEach(() => {
      cy.get('[data-cy=FirstNameInput]').clear();
      cy.get('[data-cy=LastNameInput]').clear();
      cy.get('[data-cy=EmailInput]').clear();
      cy.get('[data-cy=ThemeInput]').clear();
    })

    it('should disable btn if the form is not valid', function() {
      cy.get('[data-cy=SignUpBtn]').should('be.disabled');

      cy.get('[data-cy=FirstNameInput]').type('Bruce');
      cy.get('[data-cy=SignUpBtn]').should('be.disabled');

      cy.get('[data-cy=LastNameInput]').type('Wayne');
      cy.get('[data-cy=SignUpBtn]').should('be.disabled');

      cy.get('[data-cy=ThemeInput]').type('BatBot');
      cy.get('[data-cy=SignUpBtn]').should('be.disabled');

      cy.get('[data-cy=EmailInput]').type('bruce.wayne');
      cy.get('[data-cy=SignUpBtn]').should('be.disabled');
    });

    // E2E user is on fabnum.fr and not on gouv.fr
    // it('should stay on sign up page & show error if email already exists', function() {
    //   cy.get('[data-cy=FirstNameInput]').type('Bruce');
    //   cy.get('[data-cy=LastNameInput]').type('Wayne');
    //   cy.get('[data-cy=EmailInput]').type(Cypress.env('USER_EMAIL'));
    //   cy.get('[data-cy=ThemeInput]').type('BatBot');
    //   cy.get('[data-cy=SignUpBtn]').click();
    //
    //   cy.url().should('include', '/auth/sign_up');
    //   cy.get('.toast-message').should('contain', 'Un utilisateur avec cet email existe déjà.');
    // });
  });
});
