describe('Testing the Reset Password page', function() {

  beforeEach(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear()
    });
    cy.visit('/auth/reset_password');
    cy.get('[data-cy=PasswordInput]').clear();
    cy.get('[data-cy=PasswordCheckInput]').clear();
  })

  it('should disable reset password btn if the form is not valid', function() {
    cy.get('[data-cy=ResetPasswordBtn]').should('be.disabled');

    cy.get('[data-cy=PasswordInput]').type('password');
    cy.get('[data-cy=ResetPasswordBtn]').should('be.disabled');

    cy.get('[data-cy=PasswordInput]').clear();
    cy.get('[data-cy=PasswordCheckInput]').type('password');
    cy.get('[data-cy=ResetPasswordBtn]').should('be.disabled');


    cy.get('[data-cy=PasswordInput]').clear();
    cy.get('[data-cy=PasswordCheckInput]').clear();
    cy.get('[data-cy=PasswordInput]').type('password');
    cy.get('[data-cy=PasswordCheckInput]').type('passwordBis');
    cy.get('[data-cy=ResetPasswordBtn]').should('be.disabled');
    cy.get('.mat-error').should('contain', 'Les mot de passe ne correspondent pas.');
  });

  it('should enable button if passwords are same', function() {
    cy.get('[data-cy=PasswordInput]').type('password');
    cy.get('[data-cy=PasswordCheckInput]').type('password');
    cy.get('[data-cy=ResetPasswordBtn]').should('be.enabled');
  });
});
