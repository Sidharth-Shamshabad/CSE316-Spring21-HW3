import React, { useState } from 'react'
import { WButton, WInput, WRow, WCol } from 'wt-frontend'

const TableEntry = (props) => {
  const { data } = props

  const completeStyle = data.completed ? ' complete-task' : ' incomplete-task'
  const assignedStyle = data.completed
    ? ' assigned-complete'
    : ' assigned-incomplete'

  const clickDisabled = () => {}

  const description = data.description
  const due_date = data.due_date
  const status = data.completed ? 'complete' : 'incomplete'
  const assigned_to = data.assigned_to

  const [editingDate, toggleDateEdit] = useState(false)
  const [editingDescr, toggleDescrEdit] = useState(false)
  const [editingStatus, toggleStatusEdit] = useState(false)
  const [editingAssigned, toggleAssignedEdit] = useState(false)

  const handleDateEdit = (e) => {
    toggleDateEdit(false)
    const newDate = e.target.value ? e.target.value : 'No Date'
    const prevDate = due_date
    props.editItem(data._id, 'due_date', newDate, prevDate)
    props.setIsEditing(false)
  }

  const handleDescrEdit = (e) => {
    toggleDescrEdit(false)
    const newDescr = e.target.value ? e.target.value : 'No Description'
    const prevDescr = description
    props.editItem(data._id, 'description', newDescr, prevDescr)
    props.setIsEditing(false)
  }

  const handleStatusEdit = (e) => {
    toggleStatusEdit(false)
    const newStatus = e.target.value ? e.target.value : false
    const prevStatus = status
    props.editItem(data._id, 'completed', newStatus, prevStatus)
    props.setIsEditing(false)
  }

  const handleAssignedEdit = (e) => {
    toggleAssignedEdit(false)
    const newAssigned = e.target.value ? e.target.value : 'Not Assigned'
    const prevAssigned = assigned_to
    props.editItem(data._id, 'assigned_to', newAssigned, prevAssigned)
    props.setIsEditing(false)
  }

  return (
    <WRow className='table-entry'>
      <WCol size='3'>
        {editingDescr || description === '' ? (
          <WInput
            className='table-input'
            onBlur={handleDescrEdit}
            autoFocus={true}
            defaultValue={description}
            type='text'
            wType='outlined'
            barAnimation='solid'
            inputClass='table-input-class'
          />
        ) : (
          <div
            className='table-text'
            onClick={() => {
              toggleDescrEdit(!editingDescr)
              props.setIsEditing(true)
            }}
          >
            {description}
          </div>
        )}
      </WCol>

      <WCol size='2'>
        {editingDate ? (
          <input
            className='table-input'
            onBlur={handleDateEdit}
            autoFocus={true}
            defaultValue={due_date}
            type='date'
            wType='outlined'
            barAnimation='solid'
            inputClass='table-input-class'
          />
        ) : (
          <div
            className='table-text'
            onClick={() => {
              toggleDateEdit(!editingDate)
              props.setIsEditing(true)
            }}
          >
            {due_date}
          </div>
        )}
      </WCol>

      <WCol size='2'>
        {editingStatus ? (
          <select
            className='table-select'
            onBlur={handleStatusEdit}
            autoFocus={true}
            defaultValue={status}
          >
            <option value='complete'>complete</option>
            <option value='incomplete'>incomplete</option>
          </select>
        ) : (
          <div
            onClick={() => {
              toggleStatusEdit(!editingStatus)
              props.setIsEditing(true)
            }}
            className={`${completeStyle} table-text`}
          >
            {status}
          </div>
        )}
      </WCol>

      <WCol size='2'>
        {editingAssigned || assigned_to === '' ? (
          <WInput
            className='table-input'
            onBlur={handleAssignedEdit}
            autoFocus={true}
            defaultValue={assigned_to}
            type='text'
            wType='outlined'
            barAnimation='solid'
            inputClass='table-input-class'
          />
        ) : (
          <div
            className={`${assignedStyle} table-text`}
            onClick={() => {
              toggleAssignedEdit(!editingAssigned)
              props.setIsEditing(true)
            }}
          >
            {assigned_to}
          </div>
        )}
      </WCol>

      <WCol size='3'>
        <div className='button-group'>
          <WButton
            className='table-entry-buttons'
            onClick={() => {
              if (props.entries[0] === data) {
                clickDisabled()
              } else {
                props.reorderItem(data._id, -1)
              }
            }}
            wType='texted'
            disabled={props.entries[0] === data}
          >
            <i className='material-icons'>expand_less</i>
          </WButton>
          <WButton
            className='table-entry-buttons'
            onClick={() => {
              if (props.entries[props.entries.length - 1] === data) {
                clickDisabled()
              } else {
                props.reorderItem(data._id, 1)
              }
            }}
            wType='texted'
            disabled={props.entries[props.entries.length - 1] === data}
          >
            <i className='material-icons'>expand_more</i>
          </WButton>
          <WButton
            className='table-entry-buttons'
            onClick={() => props.deleteItem(data)}
            wType='texted'
          >
            <i className='material-icons'>close</i>
          </WButton>
        </div>
      </WCol>
    </WRow>
  )
}

export default TableEntry
