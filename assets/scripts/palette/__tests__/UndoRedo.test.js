/* eslint-env jest */
import React from 'react'
import { cleanup, fireEvent } from '@testing-library/react'
import { renderWithReduxAndIntl } from '../../../../test/helpers/render'
import UndoRedo from '../UndoRedo'

// `getRemixOnFirstEdit` is a legacy function, so for the purposes of this
// test suite it always returns `false` (aka, assume user owns the street)
jest.mock('../../streets/remix', () => ({
  getRemixOnFirstEdit: () => false
}))

describe('UndoRedo', () => {
  afterEach(() => {
    cleanup()
  })

  // TODO: Remove snapshot after having a snapshot on the parent component
  it('renders two buttons', () => {
    const wrapper = renderWithReduxAndIntl(<UndoRedo />)
    expect(wrapper.asFragment()).toMatchSnapshot()
  })

  it('handles clicking undo button', () => {
    const wrapper = renderWithReduxAndIntl(<UndoRedo />, {
      initialState: {
        undo: {
          stack: [
            { foo: 'bar' },
            { foo: 'baz' }
          ],
          position: 1
        }
      }
    })

    // Click the undo button
    fireEvent.click(wrapper.getByTitle('Undo'))

    // Redo should now be available, but undo is not.
    expect(wrapper.getByTitle('Undo')).toBeDisabled()
    expect(wrapper.getByTitle('Redo')).toBeEnabled()
  })

  it('handles clicking redo button', () => {
    const wrapper = renderWithReduxAndIntl(<UndoRedo />, {
      initialState: {
        undo: {
          stack: [
            { foo: 'bar' },
            { foo: 'baz' }
          ],
          position: 0
        }
      }
    })

    // Expect the undo position to increment when redo button is clicked
    // Click the redo button
    fireEvent.click(wrapper.getByTitle('Redo'))

    // Undo should now be available, but redo is not.
    expect(wrapper.getByTitle('Undo')).toBeEnabled()
    expect(wrapper.getByTitle('Redo')).toBeDisabled()
  })
})
