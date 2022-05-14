/* global cy */
/// <reference types="cypress" />

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const createDescription = () => `Testing ${randomInt(100000, 999999)}`
const createEmail = () => `testing${randomInt(100000, 999999)}@example.com`

const setup = () => {
  const email = createEmail()

  return cy.request({
    method: 'POST',
    url: 'http://localhost:5000/users/create',
    form: true,
    body: {
      email,
      firstName: 'Jane',
      lastName: 'Does'
    }
  }).then(res => {
    cy.wait(500)

    cy.wrap({
      email
    }).as('setup')
  })
}

describe('R8UC1', () => {
  beforeEach(() => {
    setup()

    cy.get('@setup').then(({ email }) => {
      cy.login(email)
    })

    cy.intercept('POST', 'http://localhost:5000/tasks/create').as('create');
  })

  it('creates todo when filled', () => {
    // Random suffix to make sure we don't have a duplicate
    const description = createDescription()

    cy.get('input[placeholder="Title of your Task"]').type(description)
    cy.get('input[type="submit"][value="Create new Task"]').click()

    cy.wait('@create');

    // Just to make sure react hcas time to update
    cy.wait(250)

    cy.get('.main .container .container-element').eq(-2).should('contain', description)
  })

  it('shows red border when empty', () => {
    cy.get('input[type="submit"][value="Create new Task"]').click()

    cy.get('input[placeholder="Title of your Task"]').should('have.attr', 'style', 'border-color: red')
  })
})
