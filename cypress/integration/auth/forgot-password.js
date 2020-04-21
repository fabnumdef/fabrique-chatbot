describe('Testing the Forgot Password page', function() {

  beforeEach(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear()
    });
    cy.visit('/auth/forgot_password');
    cy.get('[data-cy=EmailInput]').clear();
  })

  it('should disable forgot password btn if the form is not valid', function() {
    cy.get('[data-cy=ForgotPasswordBtn]').should('be.disabled');

    cy.get('[data-cy=EmailInput]').type('emailNotValid');
    cy.get('[data-cy=ForgotPasswordBtn]').should('be.disabled');
  });

  it('should redirect to success page if email is ok', function() {
    cy.get('[data-cy=EmailInput]').type(Cypress.env('USER_EMAIL'));
    cy.get('[data-cy=ForgotPasswordBtn]').should('be.enabled');
    cy.get('[data-cy=ForgotPasswordBtn]').click();

    cy.url().should('include', '/auth/forgot_password/success');
  });
});
