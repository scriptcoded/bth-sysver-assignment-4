/* global cy */
/// <reference types="cypress" />

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
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

    cy.request({
      method: 'POST',
      url: 'http://localhost:5000/tasks/create',
      form: true,
      body: {
        title: 'Testing',
        description: '(add a description here)',
        userid: res.body._id.$oid,
        todos: 'Watch video',
        url: ''
      }
    }).then((res) => {
      cy.wrap({
        email
      }).as('setup')
    })
  })
}

describe('R8UC3', () => {
  beforeEach(() => {
    setup()
    
    cy.get('@setup').then(({ email }) => {
      cy.login(email)
    })
  })

  it('deletes item', () => {
    cy.get('.main .container .container-element').eq(0).click()

    cy.get('.popup .todo-list .todo-item:first-child .remover').click()
    cy.get('.popup .todo-list .todo-item').should('have.length', 0)
  })
})
