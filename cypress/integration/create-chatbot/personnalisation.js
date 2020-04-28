describe('Testing third step of creating bot page', function() {

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
      cy.get('[data-cy=ProblemInput]').type('Lorem ipsum dolor sit amet, consectetuer adipiscing elit.')
      cy.get('[data-cy=AudienceInput]').type('Lorem ipsum dolor sit amet, consectetuer adipiscing elit.')
      cy.get('[data-cy=SolutionInput]').type('Lorem ipsum dolor sit amet, consectetuer adipiscing elit.')
      cy.get('[data-cy=DescNextBtn]').click();

    })

    it('should be on the Personnalisation tab', function () {
        cy.get('[data-cy=CustomizationTitle]').should('contain', 'Personnalisation');
    });

    describe('Chatbot name tests', function() {


        it('Should have chatbot name input', function() {
            cy.get('[data-cy=ChatbotNameInput]')
            .type('John Doe')
            .should("have.value", "John Doe");
        })
        it('Should have chatbot name preview', function() {
            cy.get('[data-cy=ChatbotNamePreview]')
                .should("contain", "John Doe");
        })
    })

    describe('Icon input tests', function() {

        const fixturePath = 'logo_fabrique_chatbot.png';

        it('Should have clickable icons', function() {
            
            cy.get('[data-cy=PresetIcon]').click({multiple:true});
            cy.get('[data-cy=SelectedIconWrapper').should('be.visible');
        })

        
        it('Should have update icon button', function() {
            
            cy.get('[data-cy=UpdateIconBtn').should('be.visible');
            cy.get('[data-cy=ImportIconInput]').attachFile(fixturePath, { force: true });
            cy.get('[data-cy=SelectedIconWrapper').should('be.visible');
            cy.get('[data-cy=IconName').should('contain', fixturePath)
        })

        it('Should have delete icon button', function() {
            
            cy.get('[data-cy=SelectedIconWrapper').should('be.visible');
            cy.get('[data-cy=DeleteIconBtn]').should('be.visible');
            cy.get('[data-cy=DeleteIconBtn').click();
            cy.get('[data-cy=SelectedIconWrapper').should('not.exist');
        })

        it('Should have upload icon button', function() {
            
            cy.get('[data-cy=SelectedIconWrapper').should('not.exist');
            cy.get('[data-cy=ImportIconBtn]').should('be.visible');
            cy.get('[data-cy=ImportIconInput]').attachFile(fixturePath, { force: true });
            cy.get('[data-cy=SelectedIconWrapper').should('be.visible');
            cy.get('[data-cy=DeleteIconBtn').should('be.visible');
            cy.get('[data-cy=UpdateIconBtn').should('be.visible');
            cy.get('[data-cy=IconName').should('contain', fixturePath)
        })
    })

    describe('Color pickers tests', function() {


        it('Should have primary color input div', function() {
            cy.get('[data-cy=PrimaryPicker]').should('be.visible');
        })
        it('Should have secondary color input div', function() {
            cy.get('[data-cy=SecondaryPicker]').should('be.visible');
        })
    })
    
});
  