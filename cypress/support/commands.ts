/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      login(
        email: string,
        password: string,
        redirect?: string,
      ): Chainable<Element>
    }
  }
}

Cypress.Commands.add(
  'login',
  (email: string, password: string, redirect = '/') => {
    cy.visit(redirect)
    // redirect to /login page
    cy.location('pathname').should('equal', '/login')
    // fill in email and password
    cy.get('input[name=email]').should('be.visible').type(email)
    cy.get('input[name=password]')
      .should('be.visible')
      .type(password, { log: false })
    cy.get('[type=submit]').should('be.visible').click()
    // api request is sent
    if (redirect === '/') {
      cy.location('pathname').should('not.contain', 'login')
    } else {
      cy.location('pathname').should('equal', redirect)
    }
  },
)

export {}