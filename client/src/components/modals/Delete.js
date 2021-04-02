import React from 'react'

import { WModal, WMHeader, WMMain, WButton, WMFooter } from 'wt-frontend'

const Delete = (props) => {
  const handleDelete = async () => {
    props.deleteList(props.activeid)
    props.setShowDelete(false)
  }

  return (
    <WModal visible={true} cover={true} animation='slide-fade-top'>
      <WMHeader className='modal-header'>Delete List?</WMHeader>
      <WMFooter>
        <WButton
          className='modal-button cancel-button'
          onClick={() => props.setShowDelete(false)}
          wType='texted'
        >
          Cancel
        </WButton>
        <label className='col-spacer'>&nbsp;</label>
        <WButton
          className='modal-button'
          onClick={handleDelete}
          clickAnimation='ripple-light'
          hoverAnimation='darken'
          shape='rounded'
          color='danger'
          float='right'
        >
          Delete
        </WButton>
      </WMFooter>
    </WModal>
  )
}

export default Delete
