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
      const todoId = res.body[0].todos[0]._id.$oid

      cy.wrap({
        email,
        todoId
      }).as('setup')
    })
  })
}

const setTodoDone = (todoId, done = false) => {
  return cy.request({
    method: 'PUT',
    url: `http://localhost:5000/todos/byid/${todoId}`,
    form: true,
    body: {
      data: `{'$set': {'done': ${JSON.stringify(done)}}}`
    }
  })
}


describe('R8UC2', () => {
  beforeEach(() => {
    setup()
    
    cy.get('@setup').then(({ email }) => {
      cy.login(email)
    })
  })

  it('becomes done', () => {
    cy.get('.main .container .container-element').eq(0).click()

    cy.get('.popup .todo-list .todo-item:first-child .checker').click()
    cy.get('.popup .todo-list .todo-item:first-child .checker').should('have.class', 'checked')
  })

  it('becomes active', () => {
    cy.get('@setup').then(({ todoId }) => {
      setTodoDone(todoId, true)

      cy.get('.main .container .container-element').eq(0).click()

      cy.get('.popup .todo-list .todo-item:first-child .checker').click()
      cy.get('.popup .todo-list .todo-item:first-child .checker').should('have.class', 'unchecked')
    })
  })
})
