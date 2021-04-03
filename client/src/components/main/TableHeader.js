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

  const [isUndoVisible, setUndoVisible] = useState(false)
  const [isRedoVisible, setRedoVisible] = useState(false)

  const undoButtonStyle = isUndoVisible
    ? ' table-header-button-disabled '
    : 'table-header-button '

  const redoButtonStyle = isRedoVisible
    ? ' table-header-button-disabled '
    : 'table-header-button '

  const undoColor = props.hasUndo ? 'white' : '#322d2d'
  const undoCursor = props.hasUndo ? 'pointer' : 'not-allowed'
  const undoHover = props.hasUndo ? 'enabled' : 'disabled'

  const redoColor = props.hasRedo ? 'white' : '#322d2d'
  const redoCursor = props.hasRedo ? 'pointer' : 'not-allowed'
  const redoHover = props.hasRedo ? 'enabled' : 'disabled'

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
            props.sortAssigned(props.activeList._id)
          }}
        >
          Assigned
        </WButton>
      </WCol>

      <WCol size='3'>
        <div className='table-header-buttons'>
          <WButton
            className={`${buttonStyle}`}
            id='undo-button'
            disabled={!props.hasUndo}
            onClick={(e) => {
              if (props.hasUndo) {
                props.undo()
              } else {
                clickDisabled()
              }
            }}
            wType='texted'
            clickAnimation='ripple-light'
            shape='rounded'
            style={{
              color: undoColor,
              cursor: undoCursor,
              hover: undoHover,
            }}
          >
            <i className='material-icons'>undo</i>
          </WButton>
          <WButton
            className={`${buttonStyle}`}
            id='redo-button'
            disabled={!props.hasRedo}
            onClick={(e) => {
              if (props.hasRedo) {
                setRedoVisible(true)
                props.redo()
              } else {
                clickDisabled()
              }
            }}
            wType='texted'
            clickAnimation='ripple-light'
            shape='rounded'
            style={{
              color: redoColor,
              cursor: redoCursor,
              hover: redoHover,
            }}
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
            onClick={props.disabled ? clickDisabled : () => props.closeList()}
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
