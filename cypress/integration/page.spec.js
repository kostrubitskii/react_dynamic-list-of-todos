describe('Page', () => {
  beforeEach(() => {
    cy.intercept('**/todos', { fixture: 'todos' });

    cy.visit('/');
  });

  it('should update user details after selecting a different user', () => {
    cy.intercept('**/users/1', { fixture: 'userOne' });
    cy.intercept('**/users/2', { fixture: 'userTwo' });

    cy.getByDataCy('userButton')
      .contains('1')
      .click();

    cy.getByDataCy('userName')
      .should('have.text', 'Chelsey Dietrich');

    cy.getByDataCy('userButton')
      .contains('2')
      .click();

    cy.getByDataCy('userName')
      .should('have.text', 'Mrs. Dennis Schulist');
  });

  it('should not send request to the server after selecting the same user again', () => {
    cy.intercept('**/todos', { fixture: 'todos' });
    cy.intercept('**/users/*', cy.spy().as('apiCall'));

    cy.getByDataCy('userButton')
      .contains('1')
      .click();

    cy.getByDataCy('userButton')
      .contains('1')
      .click();

    cy.get('@apiCall')
      .its('callCount')
      .should('equal', 1);
  });

  it('should clear selected user after clicking "Clear" button', () => {
    cy.intercept('**/users/1', { fixture: 'userOne' });

    cy.getByDataCy('userButton')
      .contains('1')
      .click();

    cy.getByDataCy('userName')
      .should('have.text', 'Chelsey Dietrich');

    cy.get('button')
      .contains(/[A-z]lear/)
      .click();

    cy.getByDataCy('userName')
      .should('not.exist');
  });

  it('should filter todos by title', () => {
    cy.get('input')
      .type('Todo 4');

    cy.get('li')
      .should('have.length', 1)
      .and('contain', 'Todo 4');
  });

  it('should select all todos using selector', () => {
    cy.get('select')
      .select('all');

    cy.get('li')
      .should('have.length', 3);
  });

  it('should select only active todos using selector', () => {
    cy.get('select')
      .select('completed');

    cy.get('li')
      .should('have.length', 1);
  });

  it('should select only completed todos using selector', () => {
    cy.get('select')
      .select('active');

    cy.get('li')
      .should('have.length', 2);
  });
});
