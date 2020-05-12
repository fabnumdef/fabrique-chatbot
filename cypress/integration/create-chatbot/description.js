describe('Testing second step of creating bot page', function() {

    before(() => {
      const fixturePath = 'TEMPLATE_CHATBOT-WARNING.xlsx'
      cy.window().then((win) => {
        win.sessionStorage.clear()
      });
      cy.visit('/auth/login');
      cy.get('[data-cy=EmailInput]').type(Cypress.env('USER_EMAIL'));
      cy.get('[data-cy=PasswordInput]').type(Cypress.env('USER_PASSWORD'));
      cy.get('[data-cy=LoginBtn]').click();
      cy.url().should('include', '/create');
      cy.visit('/create');
      cy.get('[data-cy=UploadFileInput]').attachFile(fixturePath, { force: true });
      cy.get('[data-cy=ParamNextBtn]').click();

    })

    const charLoremIpsum250 = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium."
    const charLoremIpsum200 = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qu";
    it('should be on the Description tab', function () {
        cy.get('[data-cy=DescriptionTitle]').should('contain', 'Description');
        });

    describe('Problem input tests', () => {
        beforeEach(() => {
            cy.get('[data-cy=ProblemInput]').clear();
          })

        it('should have problem input', function () {
            cy.get('h4').should('contain', 'À quelle problématique répond votre chatbot ?');
            cy.get('[data-cy=ProblemInput]')
            .type('John Doe')
            .invoke("val")
            .should("be.equal", "John Doe");
        });

        it('should have have less than 200 characters', function () {
            cy.get('[data-cy=ProblemInput]')
            .clear()
            .type(charLoremIpsum250)
            .invoke("val")
            .should("be.equal", charLoremIpsum200);
        });
    })

    describe('Audience input tests', () => {
        beforeEach(() => {
            cy.get('[data-cy=AudienceInput]').clear();
          })

        it('should have audience input', function () {
            cy.get('h4').should('contain', "À qui s'adresse votre chatbot ?");
            cy.get('[data-cy=AudienceInput]')
            .type('John Doe')
            .invoke("val")
            .should("be.equal", "John Doe");
        });

        it('should have have less than 200 characters', function () {
            cy.get('[data-cy=AudienceInput]')
            .type(charLoremIpsum250)
            .invoke("val")
            .should("be.equal", charLoremIpsum200);
        });
    })

    describe('Solution input tests', () => {
        beforeEach(() => {
            cy.get('[data-cy=SolutionInput]').clear();
          })

        it('should have solution input', function () {
            cy.get('h4').should('contain', 'Quelle solution propose votre chatbot ?');
            cy.get('[data-cy=SolutionInput]')
            .type('John Doe')
            .invoke("val")
            .should("be.equal", "John Doe");
        });

        it('should have have less than 200 characters', function () {
            cy.get('[data-cy=SolutionInput]')
            .type(charLoremIpsum250)
            .invoke("val")
            .should("be.equal", charLoremIpsum200);
        });
    })
});
