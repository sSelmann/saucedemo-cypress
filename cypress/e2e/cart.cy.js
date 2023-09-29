
beforeEach(() => {
    cy.login('standard_user', 'secret_sauce')
});

describe("Cart", () => {
    it('buy product', () => {
        cy.get('#add-to-cart-sauce-labs-backpack').click()
        cy.get('#remove-sauce-labs-backpack').should('have.text', 'Remove')

        cy.get('.inventory_item_name',).first().invoke('text').as('itemName')
        cy.get('.inventory_item_price',).first().invoke('text').as('itemPrice')

        cy.get('.shopping_cart_badge').should('have.text', '1')
        cy.get('.shopping_cart_link').click()

        cy.url().should('contain', '/cart.html')

        cy.get('.cart_item').should('have.length', '1')

        cy.get('@itemName').then((itemName) => {
            cy.get('.cart_item_label .inventory_item_name').should('have.text', itemName)

            cy.get('@itemPrice').then((itemPrice) => {
                cy.get('.cart_item .inventory_item_price').should('have.text', itemPrice)

                cy.get('#checkout').click()

                cy.url().should('contain', '/checkout-step-one.html')

                cy.get('#first-name')
                    .should('have.attr', 'placeholder', 'First Name')
                    .type('User')
                    .should('have.value', 'User')

                cy.get('#last-name')
                    .should('have.attr', 'placeholder', 'Last Name')
                    .type('Name')
                    .should('have.value', 'Name')

                cy.get('#postal-code')
                    .should('have.attr', 'placeholder', 'Zip/Postal Code')
                    .type('AG 66722')
                    .should('have.value', 'AG 66722')

                cy.get('#continue').click()

                cy.url().should('contain', '/checkout-step-two.html')

                cy.get('.summary_subtotal_label').invoke('text').should('contain', itemPrice)

                cy.get('.summary_tax_label').invoke('text').then((taxLabelText) => {
                    const taxParts = taxLabelText.split('$');
                    const taxAmount = taxParts[1].trim();
                    const itemTotal = itemPrice.split('$')[1].trim();
                    let totalPrice = parseFloat(taxAmount) + parseFloat(itemTotal);

                    cy.get('.summary_total_label').invoke('text').then((totalSummary) => {
                        totalSummary = parseFloat(totalSummary.split('$')[1].trim())
                        cy.expect(totalSummary).to.equal(totalPrice)
                    })
                })

            })
        })
        cy.get('#finish').click()

        cy.url().should('contain', '/checkout-complete.html')
        cy.get('.complete-header').should('have.text', 'Thank you for your order!')

        cy.get('#back-to-products').should('be.visible').should('have.text', 'Back Home').click()

        cy.url().should('contain', '/inventory.html')
    })

    it('product should be add and remove to cart', () => {
        cy.get('#add-to-cart-sauce-labs-backpack').click()
        cy.get('.shopping_cart_badge').should('have.text', '1')
        cy.get('.shopping_cart_link').click()
        cy.url().should('contain', '/cart.html')
        cy.get('.cart_item').should('have.length', 1);
        cy.get('#continue-shopping').click()
        cy.url().should('contain', '/inventory.html')

        cy.get('#remove-sauce-labs-backpack').should('have.text', 'Remove')
        cy.get('#remove-sauce-labs-backpack').click()
        cy.get('#add-to-cart-sauce-labs-backpack').should('have.text', 'Add to cart')
        cy.get('.shopping_cart_badge').should('not.exist')

        cy.get('.shopping_cart_link').click()
        cy.url().should('contain', '/cart.html')
        cy.get('.cart_item').should('have.length', 0);
    });

})