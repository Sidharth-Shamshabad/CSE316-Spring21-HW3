import React, { useState, useEffect } from 'react'

import {
  WButton,
  WRow,
  WCol,
  WModal,
  WMHeader,
  WMMain,
  WMFooter,
} from 'wt-frontend'

const TableHeader = (props) => {
  const buttonStyle = props.disabled
    ? ' table-header-button-disabled '
    : 'table-header-button '
  const clickDisabled = () => {}

  const [isVisible, setVisible] = useState(false)

  return (
    <WRow className='table-header'>
      <WCol size='3'>
        <WButton
          className='table-header-section'
          wType='texted'
          onClick={() => {
            props.sortTasks(props.activeList._id)
          }}
        >
          Task
        </WButton>
      </WCol>

      <WCol size='2'>
        <WButton
          className='table-header-section'
          wType='texted'
          onClick={() => {
            console.log('props.sortDueDate')
            props.sortDueDates(props.activeList._id)
          }}
        >
          Due Date
        </WButton>
      </WCol>

      <WCol size='2'>
        <WButton
          className='table-header-section'
          wType='texted'
          onClick={() => {
            console.log('props.sortStatus')
            props.sortStatus(props.activeList._id)
          }}
        >
          Status
        </WButton>
      </WCol>

      <WCol size='2'>
        <WButton
          className='table-header-section'
          wType='texted'
          onClick={() => {
            console.log('props.sortAssignedTo')
            props.sortAssigned(props.activeList._id)
          }}
        >
          Assigned
        </WButton>
      </WCol>

      <WCol size='3'>
        <div className='table-header-buttons'>
          <WButton
            className='sidebar-buttons undo-redo'
            onClick={(e) => {
              props.undo()
            }}
            wType='texted'
            clickAnimation='ripple-light'
            shape='rounded'
          >
            <i className='material-icons'>undo</i>
          </WButton>
          <WButton
            className='sidebar-buttons undo-redo'
            onClick={(e) => {
              props.redo()
            }}
            wType='texted'
            clickAnimation='ripple-light'
            shape='rounded'
          >
            <i className='material-icons'>redo</i>
          </WButton>
          <WButton
            onClick={props.disabled ? clickDisabled : props.addItem}
            wType='texted'
            className={`${buttonStyle}`}
          >
            <i className='material-icons'>add_box</i>
          </WButton>
          <WButton
            onClick={props.disabled ? clickDisabled : props.setShowDelete}
            wType='texted'
            className={`${buttonStyle}`}
          >
            <i className='material-icons'>delete_outline</i>
          </WButton>
          <WButton
            onClick={
              props.disabled ? clickDisabled : () => props.setActiveList({})
            }
            wType='texted'
            className={`${buttonStyle}`}
          >
            <i className='material-icons'>close</i>
          </WButton>
        </div>
      </WCol>
    </WRow>
  )
}

export default TableHeader
