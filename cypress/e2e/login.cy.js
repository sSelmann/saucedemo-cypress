beforeEach(() => {
  cy.visit('/')
})

describe('Login Page', () => {
  it('can login with valid credentials', () => {
  
  cy.fixture('users-config.json').then((config) => {
      cy.loginWithUser(config.users.standard_user)
  })

  cy.get('.shopping_cart_link')
  .should('be.visible')
  cy.url().should('contain', '/inventory.html')

  });

  it('cant login with invalid credentials', () => {
  
    cy.fixture('users-config.json').then((config) => {
      cy.loginWithUser(config.users.wrong_user)
    })

    cy.get('[data-test="error"]')
    .should('have.text', 'Epic sadface: Username and password do not match any user in this service')

  });

  it('cant login with locked_out_user', () => {
  
    cy.fixture('users-config.json').then((config) => {
      cy.loginWithUser(config.users.locked_out_user)
    })

    cy.get('[data-test="error"]')
    .should('have.text', 'Epic sadface: Sorry, this user has been locked out.')

  });

  it('problem_user should be see wrong image on items', () => {
  
    cy.fixture('users-config.json').then((config) => {
      cy.loginWithUser(config.users.problem_user)
    })

    cy.get('img.inventory_item_img')
    .should('have.length', 6)
    .should('have.attr', 'src', '/static/media/sl-404.168b1cce.jpg')

  });

})