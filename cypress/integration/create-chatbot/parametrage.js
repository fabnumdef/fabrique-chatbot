describe('Testing first step of creating bot page', function() {

    before(() => {
      cy.window().then((win) => {
        win.sessionStorage.clear()
      });
      cy.visit('/auth/login');
      cy.get('[data-cy=EmailInput]').type(Cypress.env('USER_EMAIL'));
      cy.get('[data-cy=PasswordInput]').type(Cypress.env('USER_PASSWORD'));
      cy.get('[data-cy=LoginBtn]').click();
      cy.url().should('include', '/create');
      cy.visit('/create');

    })

    it('should be on the Paramètres tab', function () {
      cy.get('[data-cy=ParamTitle]').should('contain', 'Paramétrage');
    });

    it('should have download link for chatbot template file', function () {
      const templateLink = 'https://firebasestorage.googleapis.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-M0MbNyvjB7hr1guybEn%2F-M1jG3_OcdCVFT8JT7J0%2F-M1jHaBUlqkF8rNMKV06%2FTEMPLATE_CHATBOT.xlsx?alt=media&token=f926397d-7b9c-40f5-ad1a-2f7b21283f90';
      cy.get('[data-cy=TemplateDownloadButton]').should('have.attr', 'href', templateLink)
    });

    
    it('should have btn upload', function() {
      cy.get('[data-cy=UploadFileButton]').should('be.visible');
    })

    describe('File upload', () => {

      const fixturePath = 'TEMPLATE_CHATBOT-ERREUR.xlsx'
      const fixturePathUpdated = 'TEMPLATE_CHATBOT-WARNING.xlsx'

      it('should upload .xlsx file', function() {
        
        cy.get('[data-cy=UploadFileInput]').attachFile(fixturePath, { force: true });

        cy.get('[data-cy=FileWrapper]').should('be.visible');
        cy.get('[data-cy=DeleteFileBtn]').should('be.visible');
        cy.get('[data-cy=UpdateFileBtn]').should('be.visible');
      })

      it('should display number of errors in uploaded file', function() {
        cy.get('[data-cy=FileErrorSpan]').should('be.visible');
        cy.get('[data-cy=FileErrorNumber]')
            .invoke('text')
            .should('be.equal', ' 2 ');
      })

      it('should display number of warnings in uploaded file', function() {
        cy.get('[data-cy=FileWarningNumber]')
            .invoke('text')
            .should('be.equal', ' 10 ');
      })

      it('should open error dialog', function() {
        cy.get('[data-cy=ErrorDialog]').click();
        cy.get('h2').should('contain', 'Liste des erreurs');
        cy.get('.line').its('length').as('NbErrors');
        cy.get('@NbErrors').should('be.equal', 2);
        cy.get('[data-cy=DialogCloseBtn]').click();
      })

      it('should open warning dialog', function() {
        cy.get('[data-cy=WarningDialog]').click();
        cy.get('h2').should('contain', 'Liste des avertissements');
        cy.get('.line').its('length').as('NbWarnings');
        cy.get('@NbWarnings').should('be.equal', 10);
        cy.get('[data-cy=DialogCloseBtn]').click();
      })

      it('should delete uploaded file', function() {
        cy.get('[data-cy=DeleteFileBtn]').click();
        cy.get('[data-cy=FileWrapper]').should('not.exist');
      })

      it('should update uploaded file', function() {
        cy.get('[data-cy=UploadFileInput]').attachFile(fixturePath, { force: true });
        cy.get('[data-cy=FileErrorSpan]').should('be.visible');
        cy.get('[data-cy=FileErrorNumber]')
            .invoke('text')
            .should('be.equal', ' 2 ');
        cy.get('[data-cy=FileWarningNumber]')
            .invoke('text')
            .should('be.equal', ' 10 ');

        cy.get('[data-cy=UploadFileInput]').attachFile(fixturePathUpdated, { force: true });
        cy.get('[data-cy=FileErrorSpan]').should('not.exist');
        cy.get('[data-cy=FileValidSpan]').should('be.visible');
        cy.get('[data-cy=FileErrorNumber]').should('be.visible');
        cy.get('[data-cy=FileWarningNumber]')
            .invoke('text')
            .should('be.equal', ' 8 ');
      })
    })

    describe('Clicking angular material radio', () => {

      it('Should change radio button', function() {
        cy.get('[type="radio"]').first().check({force: true});
        cy.get('[data-cy=InternetRadioBtn]').should('have.class', 'mat-radio-checked');
        cy.get('[data-cy=InternetRadioBtn]').should('have.attr', 'ng-reflect-value', 'false')
    
        cy.get('[type="radio"]').eq(1).check({force: true});
        cy.get('[data-cy=IntradefRadioBtn]').should('have.class', 'mat-radio-checked');
        cy.get('[data-cy=IntradefRadioBtn]').should('have.attr', 'ng-reflect-value', 'true')
      })
    })

    describe('Filling contact information', () => {

      it('Should have name input', function() {
        cy.get('[data-cy=NameInput]')
          .type('John Doe')
          .should("have.value", "John Doe");
      })

      it('Should have mail input', function() {
        cy.get('[data-cy=EmailInput]')
          .type('John Doe')
          .should("have.value", "John Doe");
      })

      it('Should have role selector input', function() {
        cy.get('[data-cy=RoleSelector]').click();
        cy.get('.mat-option')
          .contains('Rôle A')
          .click()
      })
    })
});
  