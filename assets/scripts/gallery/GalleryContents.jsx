import React, { useRef, useState, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import GalleryStreetItem from './GalleryStreetItem'
import Scrollable from '../ui/Scrollable'
import Avatar from '../users/Avatar'
import { switchGalleryStreet } from './view'
import { sendDeleteStreetToServer } from '../streets/xhr'
import { showError, ERRORS } from '../app/errors'
import { URL_NEW_STREET, URL_NEW_STREET_COPY_LAST } from '../app/constants'
import { deleteGalleryStreet } from '../store/actions/gallery'

GalleryContents.propTypes = {
  // Provided by Redux action creators
  deleteGalleryStreet: PropTypes.func,

  // Provided by Redux store
  userId: PropTypes.string,
  streets: PropTypes.array,
  isOwnedByCurrentUser: PropTypes.bool,
  currentStreetId: PropTypes.string
}

function GalleryContents (props) {
  const { userId, isOwnedByCurrentUser, streets = [], currentStreetId, deleteGalleryStreet } = props
  const galleryEl = useRef(null)
  const [selectedStreet, setSelectedStreet] = useState(null)

  useLayoutEffect(() => {
    if (selectedStreet) {
      const selectedEl = document.querySelector('.gallery-selected')
      // Note: smooth scroll is not supported in all browsers
      selectedEl.scrollIntoView({ behavior: 'smooth', inline: 'nearest' })
      galleryEl.current.parentNode.scrollTop = 0
    }
  }, [selectedStreet])

  function selectStreet (streetId) {
    setSelectedStreet(streetId)
    switchGalleryStreet(streetId)
  }

  function deleteStreet (streetId) {
    if (streetId === currentStreetId) {
      showError(ERRORS.NO_STREET, false)
    }

    sendDeleteStreetToServer(streetId)

    // Optimistic delete: don't re-fetch, just remove street from memory
    // and let the change in data store trigger a re-render
    setSelectedStreet(null)
    deleteGalleryStreet(streetId)
  }

  return (
    <>
      {/* Heading */}
      <div className="gallery-label" ref={galleryEl}>
        {(userId) ? (
          <>
            <Avatar userId={userId} />
            <div className="gallery-user-id">
              {userId}
            </div>
          </>
        ) : (
          <FormattedMessage id="gallery.all" defaultMessage="All streets" />
        )}
      </div>

      {/* Street count */}
      {userId && (
        <div className="gallery-street-count">
          <FormattedMessage
            id="gallery.street-count"
            defaultMessage="{count, plural, =0 {No streets yet} one {# street} other {# streets}}"
            values={{ count: streets.length }}
          />
        </div>
      )}

      {/* Gallery selection */}
      <div className="gallery-streets-container">
        {/* Display these buttons for a user viewing their own gallery */}
        {isOwnedByCurrentUser && (
          <div className="gallery-user-buttons">
            <a className="button-like gallery-new-street" href={`/${URL_NEW_STREET}`} target="_blank">
              <FormattedMessage id="btn.create" defaultMessage="Create new street" />
            </a>
            <a className="button-like gallery-copy-last-street" href={`/${URL_NEW_STREET_COPY_LAST}`} target="_blank">
              <FormattedMessage id="btn.copy" defaultMessage="Make a copy" />
            </a>
          </div>
        )}

        <Scrollable className="streets" allowKeyboardScroll>
          {streets.map((item) => (
            <GalleryStreetItem
              key={item.id}
              street={item}
              selected={selectedStreet === item.id}
              doSelect={selectStreet}
              doDelete={deleteStreet}
              showStreetOwner={userId !== item.creatorId}
              allowDelete={isOwnedByCurrentUser}
            />
          ))}
        </Scrollable>
      </div>
    </>
  )
}

const mapStateToProps = (state) => ({
  userId: state.gallery.userId,
  streets: state.gallery.streets,
  currentStreetId: state.street.id,
  isOwnedByCurrentUser: state.user.signedIn && (state.gallery.userId === state.user.signInData.userId)
})

const mapDispatchToProps = {
  deleteGalleryStreet
}

export default connect(mapStateToProps, mapDispatchToProps)(GalleryContents)
