beforeEach(() => {
  cy.visit('/')
})

describe('Login Page', () => {
  it('can login with valid credentials', () => {
  
    cy.get('#user-name').type('standard_user')
    .should('have.value', 'standard_user');
    cy.get('#password').type('secret_sauce')
    .should('have.value', 'secret_sauce')
    cy.get('#login-button').click()
    
    cy.get('.shopping_cart_link')
    .should('be.visible')

  });

  it('cant login with invalid credentials', () => {
  
    cy.get('#user-name').type('wrong_user')
    .should('have.value', 'wrong_user');
    cy.get('#password').type('secret_sauce')
    .should('have.value', 'secret_sauce')
    cy.get('#login-button').click()

    cy.get('[data-test="error"]')
    .should('have.text', 'Epic sadface: Username and password do not match any user in this service')

  });

  it('cant login with locked_out_user', () => {
  
    cy.get('#user-name').type('locked_out_user')
    .should('have.value', 'locked_out_user');
    cy.get('#password').type('secret_sauce')
    .should('have.value', 'secret_sauce')
    cy.get('#login-button').click()

    cy.get('[data-test="error"]')
    .should('have.text', 'Epic sadface: Sorry, this user has been locked out.')

  });

  it('problem_user should be see wrong image on items', () => {
  
    cy.get('#user-name').type('problem_user')
    .should('have.value', 'problem_user');
    cy.get('#password').type('secret_sauce')
    .should('have.value', 'secret_sauce')
    cy.get('#login-button').click()

    cy.get('img.inventory_item_img')
    .should('have.length', 6)
    .should('have.attr', 'src', '/static/media/sl-404.168b1cce.jpg')

  });

})